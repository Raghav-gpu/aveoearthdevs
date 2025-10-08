-- Sample data for Supabase database
-- Run this in your Supabase SQL Editor after the schema.sql

-- Insert categories
INSERT INTO public.categories (name, description) VALUES
('Home & Living', 'Eco-friendly home essentials, kitchenware, and living products'),
('Sustainable Fashion', 'Ethically made wardrobe staples, organic clothing'),
('Upcycled & Handmade', 'Artisan goods made from reclaimed materials'),
('Clean Beauty', 'Cruelty-free, natural skincare and beauty products'),
('Fitness', 'Eco-friendly fitness gear, yoga accessories, and activewear'),
('Pets', 'Sustainable pet care products, eco-friendly toys and accessories');

-- Note: Users are created through Supabase Auth when they sign up
-- Sample users are not inserted here as they need to exist in auth.users first
-- Reviews and other user-dependent data will be created when real users interact with the system

-- Insert products
INSERT INTO public.products (name, description, price, discount, category_id, stock, image_url, sustainability_score, created_at) VALUES
-- Home & Living Products
('Bamboo Kitchen Utensil Set', 'Eco-friendly bamboo utensil set. Heat resistant and gentle on cookware.', 1299, 32, (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1), 75, '/images/bamboo-utensils.jpg', 95, NOW()),
('Organic Cotton Bath Towel', 'Soft and absorbent organic cotton bath towel. Chemical-free and sustainable.', 999, 10, (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1), 80, '/images/cotton-towel.jpg', 90, NOW()),
('Beeswax Food Wraps Set', 'Set of 6 reusable beeswax food wraps. Natural alternative to plastic wrap.', 1299, 20, (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1), 80, '/images/beeswax-wraps.jpg', 96, NOW()),
('Natural Jute Area Rug', 'Hand-woven jute rug. Biodegradable and adds a natural touch to your home.', 2999, 20, (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1), 30, '/images/jute-rug.jpg', 85, NOW()),
('Eco-Friendly Dish Soap Refill', 'Concentrated dish soap refill. Plant-based and biodegradable.', 349, 5, (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1), 200, '/images/dish-soap-refill.jpg', 92, NOW()),
('Bamboo Water Bottle', 'Premium bamboo water bottle with stainless steel interior. Naturally antibacterial.', 1299, 19, (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1), 50, '/images/bamboo-bottle.jpg', 95, NOW()),

-- Sustainable Fashion
('Organic Cotton T-Shirt', '100% organic cotton t-shirt. Fair trade and sustainable fashion.', 899, 31, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 120, '/images/organic-tshirt.jpg', 89, NOW()),
('Linen Trousers - Earth Dye', 'Organic linen trousers with natural earth dye. Fair trade certified.', 1899, 24, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 60, '/images/linen-trousers.jpg', 89, NOW()),
('Hemp Denim Jacket', 'Sustainable hemp denim jacket. Durable and eco-friendly.', 2499, 20, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 35, '/images/hemp-jacket.jpg', 91, NOW()),
('Organic Cotton Hoodie', 'Comfortable organic cotton hoodie. Fair trade certified.', 1599, 30, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 45, '/images/organic-hoodie.jpg', 90, NOW()),
('Recycled Polyester Activewear Set', 'Activewear made from 100% recycled polyester bottles.', 1799, 25, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 70, '/images/recycled-activewear.jpg', 87, NOW()),
('Organic Cotton Bedsheet Set', '100% organic cotton bedsheet set. Fair trade and chemical-free.', 2999, 33, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 50, '/images/cotton-bedsheets.jpg', 92, NOW()),

-- Upcycled & Handmade
('Upcycled Denim Tote Bag', 'Handmade tote bag from upcycled denim. Unique and sustainable.', 999, 33, (SELECT id FROM public.categories WHERE name = 'Upcycled & Handmade' LIMIT 1), 45, '/images/denim-tote.jpg', 90, NOW()),
('Vintage Silk Scarf Dress', 'Upcycled vintage silk scarf dress. One-of-a-kind sustainable fashion.', 4500, 18, (SELECT id FROM public.categories WHERE name = 'Upcycled & Handmade' LIMIT 1), 15, '/images/vintage-dress.jpg', 88, NOW()),
('Upcycled Wooden Wall Shelf', 'Rustic wall shelf made from reclaimed wood. Adds character and sustainability.', 1899, 10, (SELECT id FROM public.categories WHERE name = 'Upcycled & Handmade' LIMIT 1), 25, '/images/wooden-shelf.jpg', 86, NOW()),
('Handwoven Jute Basket', 'Artisan handwoven jute basket. Perfect for storage and decoration.', 899, 15, (SELECT id FROM public.categories WHERE name = 'Upcycled & Handmade' LIMIT 1), 40, '/images/jute-basket.jpg', 88, NOW()),
('Recycled Glass Vase Set', 'Set of 3 glass vases made from 100% recycled glass. Unique and sustainable.', 1299, 20, (SELECT id FROM public.categories WHERE name = 'Upcycled & Handmade' LIMIT 1), 30, '/images/glass-vases.jpg', 87, NOW()),

-- Clean Beauty
('Natural Skincare Bundle', 'Complete organic skincare routine with 5 products. Cruelty-free and vegan.', 2499, 22, (SELECT id FROM public.categories WHERE name = 'Clean Beauty' LIMIT 1), 25, '/images/skincare-set.jpg', 98, NOW()),
('Natural Face Serum', 'Organic face serum with natural ingredients. Cruelty-free and vegan.', 1599, 27, (SELECT id FROM public.categories WHERE name = 'Clean Beauty' LIMIT 1), 80, '/images/face-serum.jpg', 96, NOW()),
('Solid Shampoo Bar - Citrus', 'Palm-oil free solid shampoo bar. Vegan and plastic-free.', 449, 36, (SELECT id FROM public.categories WHERE name = 'Clean Beauty' LIMIT 1), 90, '/images/shampoo-bar.jpg', 97, NOW()),
('Natural Deodorant Stick', 'Aluminum-free natural deodorant. Cruelty-free and effective.', 399, 25, (SELECT id FROM public.categories WHERE name = 'Clean Beauty' LIMIT 1), 120, '/images/natural-deodorant.jpg', 94, NOW()),
('Organic Lip Balm (Set of 3)', 'Set of 3 organic lip balms with natural flavors. Moisturizing and chemical-free.', 299, 10, (SELECT id FROM public.categories WHERE name = 'Clean Beauty' LIMIT 1), 150, '/images/lip-balm.jpg', 93, NOW()),
('Bamboo Face Roller', 'Natural bamboo face roller for skincare. Sustainable and effective.', 799, 20, (SELECT id FROM public.categories WHERE name = 'Clean Beauty' LIMIT 1), 60, '/images/face-roller.jpg', 95, NOW()),

-- Fitness
('Hemp Yoga Mat', 'Natural hemp yoga mat. Biodegradable and sustainable.', 2199, 24, (SELECT id FROM public.categories WHERE name = 'Fitness' LIMIT 1), 40, '/images/hemp-mat.jpg', 94, NOW()),
('Organic Cotton Activewear Set', 'Comfortable activewear made from organic cotton. Perfect for workouts.', 1799, 25, (SELECT id FROM public.categories WHERE name = 'Fitness' LIMIT 1), 70, '/images/organic-activewear.jpg', 90, NOW()),
('Bamboo Water Bottle - Fitness', 'Lightweight bamboo water bottle for active lifestyle. Biodegradable and durable.', 1299, 15, (SELECT id FROM public.categories WHERE name = 'Fitness' LIMIT 1), 60, '/images/fitness-bottle.jpg', 92, NOW()),
('Natural Rubber Resistance Bands', 'Eco-friendly resistance bands made from natural rubber. Chemical-free.', 899, 20, (SELECT id FROM public.categories WHERE name = 'Fitness' LIMIT 1), 80, '/images/resistance-bands.jpg', 88, NOW()),
('Organic Cotton Yoga Block', 'Sustainable yoga block made from organic cotton. Supportive and eco-friendly.', 599, 15, (SELECT id FROM public.categories WHERE name = 'Fitness' LIMIT 1), 50, '/images/yoga-block.jpg', 91, NOW()),

-- Pets
('Organic Pet Food - Chicken', 'Premium organic pet food made with free-range chicken. Natural and nutritious.', 1499, 20, (SELECT id FROM public.categories WHERE name = 'Pets' LIMIT 1), 100, '/images/pet-food-chicken.jpg', 90, NOW()),
('Hemp Pet Bed - Large', 'Comfortable pet bed made from hemp fiber. Natural and durable.', 2299, 15, (SELECT id FROM public.categories WHERE name = 'Pets' LIMIT 1), 30, '/images/hemp-pet-bed.jpg', 92, NOW()),
('Bamboo Pet Bowl Set', 'Eco-friendly pet bowls made from bamboo fiber. Safe and sustainable.', 599, 10, (SELECT id FROM public.categories WHERE name = 'Pets' LIMIT 1), 60, '/images/bamboo-pet-bowls.jpg', 94, NOW()),
('Natural Pet Shampoo', 'Gentle pet shampoo made with natural ingredients. Cruelty-free and effective.', 399, 25, (SELECT id FROM public.categories WHERE name = 'Pets' LIMIT 1), 80, '/images/pet-shampoo.jpg', 89, NOW()),
('Organic Cotton Pet Toy', 'Soft pet toy made from organic cotton. Safe and sustainable for your furry friend.', 299, 15, (SELECT id FROM public.categories WHERE name = 'Pets' LIMIT 1), 120, '/images/cotton-pet-toy.jpg', 87, NOW()),
('Hemp Pet Collar', 'Durable pet collar made from hemp fiber. Natural and long-lasting.', 499, 20, (SELECT id FROM public.categories WHERE name = 'Pets' LIMIT 1), 40, '/images/hemp-pet-collar.jpg', 91, NOW());

-- Note: Reviews will be created when real users interact with products
-- Sample reviews are not inserted here as they require valid user IDs from auth.users

-- Insert sample sustainability metrics
INSERT INTO public.sustainability_metrics (product_id, carbon_footprint, materials_used, certifications, created_at) VALUES
((SELECT id FROM public.products WHERE name = 'Bamboo Kitchen Utensil Set' LIMIT 1), 3.1, ARRAY['Bamboo'], ARRAY['FSC Certified', 'Food Safe'], NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Cotton T-Shirt' LIMIT 1), 1.5, ARRAY['Organic Cotton'], ARRAY['GOTS Certified', 'Fair Trade'], NOW()),
((SELECT id FROM public.products WHERE name = 'Upcycled Denim Tote Bag' LIMIT 1), 0.9, ARRAY['Recycled Denim', 'Cotton Thread'], ARRAY['Upcycled', 'Handmade'], NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Skincare Bundle' LIMIT 1), 0.8, ARRAY['Organic Aloe Vera', 'Essential Oils', 'Natural Waxes'], ARRAY['Cruelty-Free', 'Vegan', 'Organic Certified'], NOW()),
((SELECT id FROM public.products WHERE name = 'Hemp Yoga Mat' LIMIT 1), 2.8, ARRAY['Hemp Fiber', 'Natural Rubber'], ARRAY['OEKO-TEX Certified', 'Biodegradable'], NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Pet Food - Chicken' LIMIT 1), 1.2, ARRAY['Organic Chicken', 'Organic Vegetables'], ARRAY['Organic Certified', 'Cruelty-Free'], NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Water Bottle' LIMIT 1), 2.5, ARRAY['Bamboo', 'Stainless Steel'], ARRAY['FSC Certified', 'BPA Free'], NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Face Serum' LIMIT 1), 0.6, ARRAY['Organic Oils', 'Plant Extracts'], ARRAY['Cruelty-Free', 'Vegan', 'Organic'], NOW()),
((SELECT id FROM public.products WHERE name = 'Hemp Pet Bed - Large' LIMIT 1), 2.1, ARRAY['Hemp Fiber', 'Organic Cotton'], ARRAY['Natural Materials', 'Biodegradable'], NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Pet Bowl Set' LIMIT 1), 1.4, ARRAY['Bamboo Fiber', 'Natural Coating'], ARRAY['Food Safe', 'Biodegradable'], NOW());

-- Insert sample inventory logs
INSERT INTO public.inventory_log (product_id, change, reason, timestamp) VALUES
((SELECT id FROM public.products WHERE name = 'Bamboo Kitchen Utensil Set' LIMIT 1), 75, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Cotton T-Shirt' LIMIT 1), 120, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Upcycled Denim Tote Bag' LIMIT 1), 45, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Skincare Bundle' LIMIT 1), 25, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Hemp Yoga Mat' LIMIT 1), 40, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Pet Food - Chicken' LIMIT 1), 100, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Water Bottle' LIMIT 1), 50, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Face Serum' LIMIT 1), 80, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Hemp Pet Bed - Large' LIMIT 1), 30, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Pet Bowl Set' LIMIT 1), 60, 'Initial stock', NOW());

-- Note: Orders and wishlist items will be created when real users interact with the system
-- Sample orders and wishlist items are not inserted here as they require valid user IDs from auth.users

-- Summary: This script adds the following data:
-- ✅ 6 Categories (Home & Living, Sustainable Fashion, Upcycled & Handmade, Clean Beauty, Fitness, Pets)
-- ✅ 30 Products across all categories with realistic pricing and sustainability scores
-- ✅ 10 Sustainability Metrics with carbon footprint and certification data
-- ✅ 10 Inventory Logs for stock tracking
-- 
-- Total Products Added: 30
-- Categories: 6
-- Ready for user registration and interaction!