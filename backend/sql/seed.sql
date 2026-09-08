INSERT INTO organizations(name) VALUES('Demo CA Firm') ON CONFLICT DO NOTHING;
DO $$
DECLARE oid INT;
BEGIN
 SELECT id INTO oid FROM organizations WHERE name='Demo CA Firm' LIMIT 1;
 IF NOT EXISTS (SELECT 1 FROM users WHERE email='admin@example.com') THEN
   INSERT INTO users(organization_id,name,email,password_hash,role)
   VALUES(oid,'Demo Administrator','admin@example.com',
   '$2a$10$5Q0j0QxJx0mWQY5lYjZqOeYj7eY3y9h9Hh9f2l4d0V2p1u7J0X6Qe','admin');
 END IF;
END $$;
