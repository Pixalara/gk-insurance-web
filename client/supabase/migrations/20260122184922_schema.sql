-- ===============================
-- EXTENSIONS
-- ===============================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===============================
-- ENUMS (migration-safe)
-- ===============================

DO $$ BEGIN
  CREATE TYPE policy_status AS ENUM (
    'active',
    'expired',
    'renewed',
    'cancelled',
    'pending'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE policy_category AS ENUM (
    'general',
    'health',
    'life',
    'motor',
    'travel',
    'commercial',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ===============================
-- LEADS
-- ===============================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  product_type TEXT,
  source TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================
-- CUSTOMERS
-- ===============================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================
-- INSURANCE COMPANIES
-- ===============================

CREATE TABLE IF NOT EXISTS insurance_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category policy_category NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================
-- POLICIES
-- ===============================

CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  customer_id UUID NOT NULL
    REFERENCES customers(id)
    ON DELETE CASCADE,

  insurance_company_id UUID NOT NULL
    REFERENCES insurance_companies(id)
    ON DELETE RESTRICT,

  product_type_id TEXT NOT NULL,
  policy_number TEXT NOT NULL UNIQUE,

  policy_start_date DATE NOT NULL,
  policy_end_date DATE NOT NULL,

  premium_amount NUMERIC(12,2) NOT NULL,
  status policy_status DEFAULT 'active',

  vehicle_number TEXT,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================
-- INDEXES (performance)
-- ===============================

CREATE INDEX IF NOT EXISTS idx_policies_customer_id
  ON policies(customer_id);

CREATE INDEX IF NOT EXISTS idx_policies_company_id
  ON policies(insurance_company_id);

CREATE INDEX IF NOT EXISTS idx_policies_end_date
  ON policies(policy_end_date);

CREATE INDEX IF NOT EXISTS idx_customers_phone
  ON customers(phone);

-- ===============================
-- AUTO-UPDATE updated_at
-- ===============================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_policies_updated_at
BEFORE UPDATE ON policies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
