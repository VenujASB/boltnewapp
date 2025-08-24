import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react-native'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('orders').select('total'),
        supabase.from('user_profiles').select('*', { count: 'exact' })
      ])

      const totalRevenue = ordersResponse.data?.reduce((sum, order) => sum + order.total, 0) || 0

      setStats({
        totalProducts: productsResponse.count || 0,
        totalOrders: ordersResponse.data?.length || 0,
        totalUsers: usersResponse.count || 0,
        totalRevenue
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const StatCard = ({ icon, title, value, color }: { 
    icon: React.ReactNode, 
    title: string, 
    value: string | number, 
    color: string 
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  )

  const MenuButton = ({ icon, title, onPress }: {
    icon: React.ReactNode,
    title: string,
    onPress: () => void
  }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuButtonIcon}>
        {icon}
      </View>
      <Text style={styles.menuButtonText}>{title}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your store</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon={<Package size={24} color="#3B82F6" />}
            title="Products"
            value={stats.totalProducts}
            color="#3B82F6"
          />
          <StatCard
            icon={<ShoppingCart size={24} color="#10B981" />}
            title="Orders"
            value={stats.totalOrders}
            color="#10B981"
          />
          <StatCard
            icon={<Users size={24} color="#F59E0B" />}
            title="Users"
            value={stats.totalUsers}
            color="#F59E0B"
          />
          <StatCard
            icon={<DollarSign size={24} color="#EF4444" />}
            title="Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="#EF4444"
          />
        </View>

        <View style={styles.menuContainer}>
          <MenuButton
            icon={<Package size={24} color="#3B82F6" />}
            title="Manage Products"
            onPress={() => router.push('/(tabs)/admin/products')}
          />
          <MenuButton
            icon={<ShoppingCart size={24} color="#10B981" />}
            title="Manage Orders"
            onPress={() => router.push('/(tabs)/admin/orders')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
})