-- Sample data for Supabase database
-- Run this in your Supabase SQL Editor after the schema.sql

-- Insert categories
INSERT INTO public.categories (name, description) VALUES
('Zero Waste', 'Products that help reduce waste and promote sustainable living'),
('Sustainable Fashion', 'Eco-friendly clothing and accessories'),
('Natural Beauty', 'Cruelty-free and organic beauty products'),
('Green Technology', 'Energy-efficient and sustainable tech solutions'),
('Eco Home', 'Sustainable home and kitchen products'),
('Upcycled', 'Products made from recycled and repurposed materials'),
('Organic Food', 'Organic and locally sourced food products'),
('Eco Travel', 'Sustainable travel and outdoor gear');

-- Note: Users are created through Supabase Auth when they sign up
-- Sample users are not inserted here as they need to exist in auth.users first
-- Reviews and other user-dependent data will be created when real users interact with the system

-- Insert products
INSERT INTO public.products (name, description, price, discount, category_id, stock, image_url, sustainability_score, created_at) VALUES
-- Zero Waste Products
('Eco Bamboo Water Bottle', 'Premium bamboo water bottle with stainless steel interior. Naturally antibacterial and eco-friendly.', 1299, 19, (SELECT id FROM public.categories WHERE name = 'Zero Waste' LIMIT 1), 50, '/images/bamboo-bottle.jpg', 95, NOW()),
('Organic Cotton Bag Set (Set of 5)', 'Set of 5 reusable organic cotton tote bags. Perfect for grocery shopping and daily use.', 899, 25, (SELECT id FROM public.categories WHERE name = 'Zero Waste' LIMIT 1), 100, '/images/cotton-bags.jpg', 92, NOW()),
('Hemp Yoga Mat', 'Natural hemp yoga mat. Biodegradable and sustainable.', 2199, 24, (SELECT id FROM public.categories WHERE name = 'Zero Waste' LIMIT 1), 40, '/images/hemp-mat.jpg', 94, NOW()),
('Refillable Toothpaste Tablets', 'Zero waste toothpaste tablets. Plastic-free oral care.', 599, 25, (SELECT id FROM public.categories WHERE name = 'Zero Waste' LIMIT 1), 150, '/images/toothpaste-tablets.jpg', 98, NOW()),
('Organic Quinoa 1kg', 'Premium organic quinoa. Fair trade and sustainable agriculture.', 649, 0, (SELECT id FROM public.categories WHERE name = 'Zero Waste' LIMIT 1), 200, '/images/organic-quinoa.jpg', 85, NOW()),
('Beeswax Food Wraps Set', 'Set of 6 reusable beeswax food wraps. Natural alternative to plastic wrap.', 1299, 20, (SELECT id FROM public.categories WHERE name = 'Zero Waste' LIMIT 1), 80, '/images/beeswax-wraps.jpg', 96, NOW()),
('Compostable Phone Case', 'Biodegradable phone case made from plant-based materials.', 799, 15, (SELECT id FROM public.categories WHERE name = 'Zero Waste' LIMIT 1), 120, '/images/compostable-case.jpg', 93, NOW()),

-- Sustainable Fashion
('Organic Cotton T-Shirt', '100% organic cotton t-shirt. Fair trade and sustainable fashion.', 899, 31, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 120, '/images/organic-tshirt.jpg', 89, NOW()),
('Linen Trousers - Earth Dye', 'Organic linen trousers with natural earth dye. Fair trade certified.', 1899, 24, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 60, '/images/linen-trousers.jpg', 89, NOW()),
('Organic Cotton Bedsheet Set', '100% organic cotton bedsheet set. Fair trade and chemical-free.', 2999, 33, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 50, '/images/cotton-bedsheets.jpg', 92, NOW()),
('Hemp Denim Jacket', 'Sustainable hemp denim jacket. Durable and eco-friendly.', 2499, 20, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 35, '/images/hemp-jacket.jpg', 91, NOW()),
('Recycled Polyester Activewear Set', 'Activewear made from 100% recycled polyester bottles.', 1799, 25, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 70, '/images/recycled-activewear.jpg', 87, NOW()),
('Organic Cotton Hoodie', 'Comfortable organic cotton hoodie. Fair trade certified.', 1599, 30, (SELECT id FROM public.categories WHERE name = 'Sustainable Fashion' LIMIT 1), 45, '/images/organic-hoodie.jpg', 90, NOW()),

-- Natural Beauty
('Natural Skincare Bundle', 'Complete organic skincare routine with 5 products. Cruelty-free and vegan.', 2499, 22, (SELECT id FROM public.categories WHERE name = 'Natural Beauty' LIMIT 1), 25, '/images/skincare-set.jpg', 98, NOW()),
('Natural Face Serum', 'Organic face serum with natural ingredients. Cruelty-free and vegan.', 1599, 27, (SELECT id FROM public.categories WHERE name = 'Natural Beauty' LIMIT 1), 80, '/images/face-serum.jpg', 96, NOW()),
('Solid Shampoo Bar - Citrus', 'Palm-oil free solid shampoo bar. Vegan and plastic-free.', 449, 36, (SELECT id FROM public.categories WHERE name = 'Natural Beauty' LIMIT 1), 90, '/images/shampoo-bar.jpg', 97, NOW()),
('Natural Deodorant Stick', 'Aluminum-free natural deodorant. Cruelty-free and effective.', 399, 25, (SELECT id FROM public.categories WHERE name = 'Natural Beauty' LIMIT 1), 120, '/images/natural-deodorant.jpg', 94, NOW()),
('Organic Lip Balm Set', 'Set of 3 organic lip balms with natural flavors. Vegan and cruelty-free.', 699, 20, (SELECT id FROM public.categories WHERE name = 'Natural Beauty' LIMIT 1), 100, '/images/lip-balm-set.jpg', 95, NOW()),
('Natural Face Cleanser', 'Gentle organic face cleanser. Suitable for all skin types.', 899, 15, (SELECT id FROM public.categories WHERE name = 'Natural Beauty' LIMIT 1), 75, '/images/face-cleanser.jpg', 93, NOW()),

-- Green Technology
('Solar Power Bank', 'Portable solar charger for mobile devices. Renewable energy solution.', 2499, 24, (SELECT id FROM public.categories WHERE name = 'Green Technology' LIMIT 1), 30, '/images/solar-charger.jpg', 92, NOW()),
('Modular Desk Lamp - Bamboo/LED', 'Energy-efficient LED desk lamp with bamboo construction. Low energy consumption.', 5999, 20, (SELECT id FROM public.categories WHERE name = 'Green Technology' LIMIT 1), 20, '/images/led-lamp.jpg', 87, NOW()),
('Bamboo Phone Case', 'Sustainable bamboo phone case. Biodegradable and protective.', 799, 20, (SELECT id FROM public.categories WHERE name = 'Green Technology' LIMIT 1), 100, '/images/bamboo-phone-case.jpg', 91, NOW()),
('Smart Thermostat', 'Energy-efficient smart thermostat. Reduces heating costs by up to 30%.', 8999, 15, (SELECT id FROM public.categories WHERE name = 'Green Technology' LIMIT 1), 15, '/images/smart-thermostat.jpg', 88, NOW()),
('Solar Panel Kit', 'Portable solar panel kit for camping and emergency use.', 12999, 10, (SELECT id FROM public.categories WHERE name = 'Green Technology' LIMIT 1), 10, '/images/solar-panel-kit.jpg', 95, NOW()),

-- Eco Home
('Bamboo Kitchen Utensil Set', 'Eco-friendly bamboo utensil set. Heat resistant and gentle on cookware.', 1299, 32, (SELECT id FROM public.categories WHERE name = 'Eco Home' LIMIT 1), 75, '/images/bamboo-utensils.jpg', 95, NOW()),
('Organic Cotton Towel Set', 'Set of 4 organic cotton bath towels. Soft and absorbent.', 1999, 25, (SELECT id FROM public.categories WHERE name = 'Eco Home' LIMIT 1), 60, '/images/cotton-towels.jpg', 90, NOW()),
('Bamboo Cutting Board', 'Sustainable bamboo cutting board. Naturally antibacterial.', 899, 20, (SELECT id FROM public.categories WHERE name = 'Eco Home' LIMIT 1), 85, '/images/bamboo-cutting-board.jpg', 94, NOW()),
('Natural Fiber Rug', 'Handwoven rug made from natural fibers. Ethically sourced.', 3499, 30, (SELECT id FROM public.categories WHERE name = 'Eco Home' LIMIT 1), 25, '/images/natural-rug.jpg', 89, NOW()),
('Eco-Friendly Dish Soap', 'Concentrated dish soap made from plant-based ingredients.', 299, 0, (SELECT id FROM public.categories WHERE name = 'Eco Home' LIMIT 1), 200, '/images/eco-dish-soap.jpg', 92, NOW()),

-- Upcycled Products
('Recycled PET Water Bottle', 'Water bottle made from 100% recycled PET. BPA-free and eco-friendly.', 499, 38, (SELECT id FROM public.categories WHERE name = 'Upcycled' LIMIT 1), 200, '/images/recycled-bottle.jpg', 89, NOW()),
('Upcycled Denim Tote Bag', 'Handmade tote bag from upcycled denim. Unique and sustainable.', 999, 33, (SELECT id FROM public.categories WHERE name = 'Upcycled' LIMIT 1), 45, '/images/denim-tote.jpg', 90, NOW()),
('Vintage Silk Scarf Dress', 'Upcycled vintage silk scarf dress. One-of-a-kind sustainable fashion.', 4500, 18, (SELECT id FROM public.categories WHERE name = 'Upcycled' LIMIT 1), 15, '/images/vintage-dress.jpg', 88, NOW()),
('Recycled Glass Jars Set', 'Set of 6 glass jars made from 100% recycled glass. Perfect for storage.', 2999, 0, (SELECT id FROM public.categories WHERE name = 'Upcycled' LIMIT 1), 75, '/images/glass-jars.jpg', 88, NOW()),
('Upcycled Wooden Shelf', 'Handcrafted shelf made from reclaimed wood. Unique and sustainable.', 2499, 20, (SELECT id FROM public.categories WHERE name = 'Upcycled' LIMIT 1), 30, '/images/upcycled-shelf.jpg', 85, NOW()),

-- Organic Food
('Organic Honey 500g', 'Raw organic honey from local beekeepers. Pure and unprocessed.', 899, 10, (SELECT id FROM public.categories WHERE name = 'Organic Food' LIMIT 1), 100, '/images/organic-honey.jpg', 90, NOW()),
('Organic Green Tea Set', 'Premium organic green tea collection. Fair trade certified.', 1299, 15, (SELECT id FROM public.categories WHERE name = 'Organic Food' LIMIT 1), 80, '/images/green-tea-set.jpg', 88, NOW()),
('Organic Coconut Oil', 'Cold-pressed organic coconut oil. Perfect for cooking and skincare.', 599, 20, (SELECT id FROM public.categories WHERE name = 'Organic Food' LIMIT 1), 150, '/images/coconut-oil.jpg', 92, NOW()),
('Organic Spice Collection', 'Set of 8 organic spices. Ethically sourced and aromatic.', 1499, 25, (SELECT id FROM public.categories WHERE name = 'Organic Food' LIMIT 1), 60, '/images/spice-collection.jpg', 87, NOW()),

-- Eco Travel
('Bamboo Travel Utensil Set', 'Portable bamboo utensil set for travel. Lightweight and sustainable.', 699, 20, (SELECT id FROM public.categories WHERE name = 'Eco Travel' LIMIT 1), 90, '/images/travel-utensils.jpg', 94, NOW()),
('Recycled Polyester Travel Bag', 'Durable travel bag made from recycled materials. Water-resistant.', 1999, 30, (SELECT id FROM public.categories WHERE name = 'Eco Travel' LIMIT 1), 40, '/images/travel-bag.jpg', 86, NOW()),
('Solar-Powered Camping Light', 'Portable solar light for camping. Weather-resistant and long-lasting.', 1299, 25, (SELECT id FROM public.categories WHERE name = 'Eco Travel' LIMIT 1), 50, '/images/camping-light.jpg', 91, NOW());

-- Note: Reviews will be created when real users interact with products
-- Sample reviews are not inserted here as they require valid user IDs from auth.users

-- Insert sample sustainability metrics
INSERT INTO public.sustainability_metrics (product_id, carbon_footprint, materials_used, certifications, created_at) VALUES
((SELECT id FROM public.products WHERE name = 'Eco Bamboo Water Bottle' LIMIT 1), 2.5, ARRAY['Bamboo', 'Stainless Steel'], ARRAY['FSC Certified', 'BPA Free'], NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Cotton Bag Set (Set of 5)' LIMIT 1), 1.2, ARRAY['Organic Cotton'], ARRAY['GOTS Certified', 'Fair Trade'], NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Skincare Bundle' LIMIT 1), 0.8, ARRAY['Organic Aloe Vera', 'Essential Oils', 'Natural Waxes'], ARRAY['Cruelty-Free', 'Vegan', 'Organic Certified'], NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Kitchen Utensil Set' LIMIT 1), 3.1, ARRAY['Bamboo'], ARRAY['FSC Certified', 'Food Safe'], NOW()),
((SELECT id FROM public.products WHERE name = 'Solar Power Bank' LIMIT 1), 5.2, ARRAY['Recycled Plastic', 'Solar Panels', 'Lithium-ion'], ARRAY['Energy Star', 'RoHS Compliant'], NOW()),
((SELECT id FROM public.products WHERE name = 'Hemp Yoga Mat' LIMIT 1), 2.8, ARRAY['Hemp Fiber', 'Natural Rubber'], ARRAY['OEKO-TEX Certified', 'Biodegradable'], NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Cotton T-Shirt' LIMIT 1), 1.5, ARRAY['Organic Cotton'], ARRAY['GOTS Certified', 'Fair Trade'], NOW()),
((SELECT id FROM public.products WHERE name = 'Recycled PET Water Bottle' LIMIT 1), 1.8, ARRAY['Recycled PET'], ARRAY['BPA Free', 'Recyclable'], NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Face Serum' LIMIT 1), 0.6, ARRAY['Organic Oils', 'Plant Extracts'], ARRAY['Cruelty-Free', 'Vegan', 'Organic'], NOW()),
((SELECT id FROM public.products WHERE name = 'Upcycled Denim Tote Bag' LIMIT 1), 0.9, ARRAY['Recycled Denim', 'Cotton Thread'], ARRAY['Upcycled', 'Handmade'], NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Phone Case' LIMIT 1), 1.3, ARRAY['Bamboo', 'Plant-based Coating'], ARRAY['Biodegradable', 'Eco-Friendly'], NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Honey 500g' LIMIT 1), 0.4, ARRAY['Raw Honey'], ARRAY['Organic Certified', 'Local Sourced'], NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Travel Utensil Set' LIMIT 1), 1.1, ARRAY['Bamboo', 'Stainless Steel'], ARRAY['FSC Certified', 'Travel Safe'], NOW()),
((SELECT id FROM public.products WHERE name = 'Solar-Powered Camping Light' LIMIT 1), 2.2, ARRAY['Recycled Plastic', 'Solar Cells', 'LED'], ARRAY['Energy Efficient', 'Weather Resistant'], NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Coconut Oil' LIMIT 1), 0.7, ARRAY['Organic Coconut'], ARRAY['Organic Certified', 'Cold Pressed'], NOW());

-- Insert sample inventory logs
INSERT INTO public.inventory_log (product_id, change, reason, timestamp) VALUES
((SELECT id FROM public.products WHERE name = 'Eco Bamboo Water Bottle' LIMIT 1), 50, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Cotton Bag Set (Set of 5)' LIMIT 1), 100, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Skincare Bundle' LIMIT 1), 25, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Kitchen Utensil Set' LIMIT 1), 75, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Solar Power Bank' LIMIT 1), 30, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Hemp Yoga Mat' LIMIT 1), 40, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Cotton T-Shirt' LIMIT 1), 120, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Recycled PET Water Bottle' LIMIT 1), 200, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Natural Face Serum' LIMIT 1), 80, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Upcycled Denim Tote Bag' LIMIT 1), 45, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Phone Case' LIMIT 1), 100, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Honey 500g' LIMIT 1), 100, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Bamboo Travel Utensil Set' LIMIT 1), 90, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Solar-Powered Camping Light' LIMIT 1), 50, 'Initial stock', NOW()),
((SELECT id FROM public.products WHERE name = 'Organic Coconut Oil' LIMIT 1), 150, 'Initial stock', NOW());

-- Note: Orders and wishlist items will be created when real users interact with the system
-- Sample orders and wishlist items are not inserted here as they require valid user IDs from auth.users

-- Summary: This script adds the following data:
-- ✅ 8 Categories (Zero Waste, Sustainable Fashion, Natural Beauty, Green Technology, Eco Home, Upcycled, Organic Food, Eco Travel)
-- ✅ 35 Products across all categories with realistic pricing and sustainability scores
-- ✅ 15 Sustainability Metrics with carbon footprint and certification data
-- ✅ 15 Inventory Logs for stock tracking
-- 
-- Total Products Added: 35
-- Categories: 8
-- Ready for user registration and interaction!