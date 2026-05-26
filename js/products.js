/**
 * Efenti Parketta – Product Data Layer (Supabase)
 * Include AFTER the Supabase CDN script.
 */
(function () {
  var SUPABASE_URL = 'https://ddtawzgexyckuystwjif.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_aTbq1sgG92XYDJcdqMumYA_g57Eq25P';
  var _client = null;

  function db() {
    if (!_client) _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _client;
  }

  window.EfentiProducts = {
    /** Expose raw client for auth calls in admin */
    client: db,

    /** All active products ordered by id (for public page) */
    getActive: function () {
      return db().from('products').select('*').eq('active', true).order('id');
    },

    /** All products including inactive (for admin) */
    getAll: function () {
      return db().from('products').select('*').order('id');
    },

    /** Insert a new product row */
    add: function (data) {
      return db().from('products').insert([data]).select().single();
    },

    /** Update a product by id */
    update: function (id, data) {
      return db().from('products').update(data).eq('id', id).select().single();
    },

    /** Delete a product by id */
    remove: function (id) {
      return db().from('products').delete().eq('id', id);
    },

    /** Flip the active flag, returns new boolean state */
    toggleActive: async function (id) {
      var res = await db().from('products').select('active').eq('id', id).single();
      if (res.error || !res.data) return null;
      var next = !res.data.active;
      await db().from('products').update({ active: next }).eq('id', id);
      return next;
    }
  };
})();
