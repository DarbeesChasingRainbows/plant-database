-- add_culinary_uses_table.sql
-- Creates the culinary_uses table for storing information about how plants are used in cooking

CREATE TABLE IF NOT EXISTS culinary_uses (
    use_id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    edible_parts TEXT[],
    flavor_profile VARCHAR(255),
    culinary_category VARCHAR(100),
    preparation_methods TEXT,
    common_dishes TEXT,
    cuisines TEXT[],
    harvesting_season VARCHAR(100),
    nutritional_info TEXT,
    substitutions TEXT,
    pairs_with TEXT[],
    storage_method VARCHAR(100),
    preservation_methods TEXT,
    special_considerations TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
