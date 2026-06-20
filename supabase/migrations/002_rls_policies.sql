ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND is_admin = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "health_select" ON health_details
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "health_insert" ON health_details
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "health_update" ON health_details
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "chat_select" ON chat_history
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "chat_insert" ON chat_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "chunks_select" ON knowledge_chunks
  FOR SELECT USING (TRUE);

CREATE POLICY "safety_admin_select" ON safety_logs
  FOR SELECT USING (is_admin());

