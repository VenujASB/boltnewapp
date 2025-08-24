import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { ShoppingCart } from 'lucide-react-native'
import { Button } from './ui/Button'
import { useCart } from '@/contexts/CartContext'
import { router } from 'expo-router'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  stock: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product.id)
  }

  const handlePress = () => {
    router.push(`/product/${product.id}`)
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <Image 
        source={{ uri: product.images[0] || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg' }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.stock}>Stock: {product.stock}</Text>
        <Button
          title="Add to Cart"
          variant="primary"
          size="sm"
          onPress={handleAddToCart}
          style={styles.addButton}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  stock: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  addButton: {
    marginTop: 8,
  },
})