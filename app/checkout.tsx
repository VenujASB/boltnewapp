import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { router } from 'expo-router'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface ShippingInfo {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function Checkout() {
  const { user } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  })

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const { name, address, city, postalCode } = shippingInfo
    return name && address && city && postalCode
  }

  const processPayment = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all shipping information')
      return
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty')
      return
    }

    setLoading(true)

    try {
      // Create payment intent
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            user_id: user?.id,
            items: JSON.stringify(items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.product.price
            })))
          }
        })
      })

      const paymentIntent = await response.json()

      if (!response.ok) {
        throw new Error(paymentIntent.error || 'Payment failed')
      }

      // Create order in database
      const { error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user?.id,
            total: totalPrice,
            status: 'pending',
            shipping_info: shippingInfo,
            items: items.map(item => ({
              product_id: item.product_id,
              product_name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            })),
            payment_intent_id: paymentIntent.id
          }
        ])

      if (orderError) {
        throw new Error('Failed to create order')
      }

      // Clear cart
      await clearCart()

      // Navigate to confirmation
      router.replace('/order-confirmation')

    } catch (error) {
      Alert.alert('Payment Failed', error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <Input
            label="Full Name"
            value={shippingInfo.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter your full name"
          />

          <Input
            label="Address"
            value={shippingInfo.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Enter your street address"
          />

          <Input
            label="City"
            value={shippingInfo.city}
            onChangeText={(value) => handleInputChange('city', value)}
            placeholder="Enter your city"
          />

          <Input
            label="Postal Code"
            value={shippingInfo.postalCode}
            onChangeText={(value) => handleInputChange('postalCode', value)}
            placeholder="Enter your postal code"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Pay $${totalPrice.toFixed(2)}`}
          onPress={processPayment}
          loading={loading}
          size="lg"
          style={styles.payButton}
        />
      </View>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    marginTop: 0,
  },
})