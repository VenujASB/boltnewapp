import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  user_id: string
  total: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  user_profiles: {
    full_name: string
    email: string
  }
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles (full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (data) {
        setOrders(data as Order[])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (!error) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ))
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B'
      case 'shipped': return '#3B82F6'
      case 'delivered': return '#10B981'
      case 'cancelled': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.id.slice(-8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.user_profiles?.full_name}</Text>
      <Text style={styles.customerEmail}>{item.user_profiles?.email}</Text>
      <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      <Text style={styles.orderDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>

      <View style={styles.statusButtons}>
        {['pending', 'shipped', 'delivered'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              item.status === status && styles.activeStatusButton
            ]}
            onPress={() => updateOrderStatus(item.id, status)}
          >
            <Text
              style={[
                styles.statusButtonText,
                item.status === status && styles.activeStatusButtonText
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Management</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        refreshing={loading}
        onRefresh={fetchOrders}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  ordersList: {
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeStatusButton: {
    backgroundColor: '#3B82F6',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeStatusButtonText: {
    color: '#FFFFFF',
  },
})