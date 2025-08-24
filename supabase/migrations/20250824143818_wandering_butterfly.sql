/*
  # Sample Data for JustBuy E-commerce App

  This migration inserts sample products to populate the store for demonstration purposes.
*/

-- Insert sample products
INSERT INTO products (name, description, price, stock, images, category) VALUES
  (
    'Wireless Bluetooth Headphones',
    'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal clear sound quality.',
    199.99,
    25,
    ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
    'electronics'
  ),
  (
    'Smartphone Case',
    'Durable protective case with shock absorption and wireless charging compatibility.',
    29.99,
    100,
    ARRAY['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'],
    'electronics'
  ),
  (
    'Cotton T-Shirt',
    'Comfortable 100% organic cotton t-shirt available in multiple colors and sizes.',
    24.99,
    50,
    ARRAY['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
    'clothing'
  ),
  (
    'Running Shoes',
    'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
    129.99,
    35,
    ARRAY['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
    'sports'
  ),
  (
    'Coffee Mug',
    'Ceramic coffee mug with ergonomic handle and heat-resistant design.',
    14.99,
    75,
    ARRAY['https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg'],
    'home'
  ),
  (
    'Laptop Stand',
    'Adjustable aluminum laptop stand for ergonomic workspace setup.',
    49.99,
    40,
    ARRAY['https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg'],
    'electronics'
  ),
  (
    'Yoga Mat',
    'Non-slip yoga mat with extra cushioning for comfortable practice.',
    39.99,
    60,
    ARRAY['https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg'],
    'sports'
  ),
  (
    'LED Desk Lamp',
    'Adjustable LED desk lamp with touch controls and multiple brightness levels.',
    69.99,
    30,
    ARRAY['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg'],
    'home'
  );