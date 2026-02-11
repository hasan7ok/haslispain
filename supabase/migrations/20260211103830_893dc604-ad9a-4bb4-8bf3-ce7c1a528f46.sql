
-- chat_rate_limits: allow users to read only their own records
CREATE POLICY "Users can view their own rate limits"
ON public.chat_rate_limits
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
