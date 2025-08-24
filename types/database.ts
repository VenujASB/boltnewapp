export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          stock: number
          images: string[]
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          stock: number
          images: string[]
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          stock?: number
          images?: string[]
          category?: string
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total: number
          status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
          shipping_info: any
          items: any
          payment_intent_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total: number
          status?: 'pending' | 'shipped' | 'delivered' | 'cancelled'
          shipping_info: any
          items: any
          payment_intent_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total?: number
          status?: 'pending' | 'shipped' | 'delivered' | 'cancelled'
          shipping_info?: any
          items?: any
          payment_intent_id?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
    }
  }
}