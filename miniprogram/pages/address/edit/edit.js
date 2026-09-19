const addressApi = require('../../../utils/address.js');

Page({
  data: {
    isEdit: false, addressId: '',
    form: { name: '', phone: '', region: [], regionText: '', detail: '', isDefault: false }
  },

  onLoad(options) {
    if (options.id) {
      const address = addressApi.getAddressById(options.id);
      if (address) {
        this.setData({
          isEdit: true, addressId: options.id,
          form: {
            name: address.name || '', phone: address.phone || '',
            region: address.region || [], regionText: (address.region || []).join(' '),
            detail: address.detail || '', isDefault: !!address.isDefault
          }
        });
        wx.setNavigationBarTitle({ title: '编辑收货地址' });
      }
    } else {
      wx.setNavigationBarTitle({ title: '新增收货地址' });
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onSwitchChange(e) { this.setData({ 'form.isDefault': e.detail.value }); },

  onChooseRegion() {
    wx.chooseRegion({
      success: (res) => {
        const region = [res.provinceName, res.cityName, res.districtName];
        this.setData({ 'form.region': region, 'form.regionText': region.join(' ') });
      },
      fail: () => this.fallbackRegionPicker()
    });
  },

  fallbackRegionPicker() {
    wx.showModal({
      title: '输入地区', editable: true, placeholderText: '格式：广东省 深圳市 南山区',
      success: (res) => {
        if (res.confirm && res.content) {
          const parts = res.content.trim().split(/\s+/);
          if (parts.length >= 3) {
            this.setData({ 'form.region': parts.slice(0, 3), 'form.regionText': parts.slice(0, 3).join(' ') });
          } else {
            wx.showToast({ title: '请输入完整省市区', icon: 'none' });
          }
        }
      }
    });
  },

  onSave() {
    const form = { ...this.data.form };
    const error = addressApi.validateAddress(form);
    if (error) { wx.showToast({ title: error, icon: 'none' }); return; }
    if (this.data.isEdit) form.id = this.data.addressId;
    addressApi.saveAddress(form);
    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 800);
  }
});