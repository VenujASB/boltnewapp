import { useEffect } from 'react'
import { router } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'

export default function Index() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)')
      } else {
        router.replace('/(auth)/sign-in')
      }
    }
  }, [user, loading])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
})