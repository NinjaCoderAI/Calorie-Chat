const supabase = require('../config/supabase');

class DatabaseService {
  async createUser(phone) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ phone, subscription_status: 'inactive' }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async updateSubscription(phone, status) {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_status: status })
      .eq('phone', phone)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getActiveSubscribers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('subscription_status', 'active');
    
    if (error) throw error;
    return data;
  }
}

module.exports = new DatabaseService();
