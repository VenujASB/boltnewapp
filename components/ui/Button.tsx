import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'primary' | 'secondary' | 'outline'
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  title, 
  variant = 'primary', 
  loading = false, 
  size = 'md',
  style, 
  disabled,
  ...props 
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]]
    
    if (variant === 'primary') {
      baseStyle.push(styles.primary)
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondary)
    } else if (variant === 'outline') {
      baseStyle.push(styles.outline)
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabled)
    }
    
    return baseStyle
  }

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]]
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryText)
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText)
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineText)
    }
    
    return baseStyle
  }

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#FFFFFF' : '#3B82F6'} 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  primary: {
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: '#10B981',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#3B82F6',
  },
})