import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CircleCheck as CheckCircle } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { router } from 'expo-router'

export default function OrderConfirmation() {
  const handleContinueShopping = () => {
    router.replace('/(tabs)/home')
  }

  const handleViewOrders = () => {
    router.replace('/(tabs)/account')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#10B981" />
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase. Your order has been successfully placed and will be processed shortly.
        </Text>

        <Text style={styles.orderInfo}>
          You'll receive an email confirmation with order details and tracking information once your order ships.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue Shopping"
            onPress={handleContinueShopping}
            size="lg"
            style={styles.primaryButton}
          />

          <Button
            title="View My Orders"
            variant="outline"
            onPress={handleViewOrders}
            size="lg"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  orderInfo: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    marginBottom: 16,
  },
  secondaryButton: {
    marginBottom: 0,
  },
})