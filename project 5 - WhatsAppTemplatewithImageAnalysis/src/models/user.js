import { supabase } from '../config/supabase.js';

export class User {
  static async create(phone, subscriptionStatus = 'inactive') {
    const { data, error } = await supabase
      .from('users')
      .insert([{ phone, subscription_status: subscriptionStatus }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async updateSubscription(phone, status) {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_status: status })
      .eq('phone', phone)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  static async getByPhone(phone) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) throw error;
    return data;
  }
}