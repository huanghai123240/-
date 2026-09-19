const addressApi = require('../../../utils/address.js');

Page({
  data: { addressList: [], isSelectMode: false, selectedId: '' },

  onLoad(options) {
    if (options.scene === 'select') {
      this.setData({ isSelectMode: true });
      wx.setNavigationBarTitle({ title: '选择收货地址' });
    } else {
      wx.setNavigationBarTitle({ title: '收货地址' });
    }
  },

  onShow() { this.loadAddressList(); },

  loadAddressList() {
    const list = addressApi.getAddressList();
    const formattedList = list.map(item => ({ ...item, regionText: (item.region || []).join(' ') }));
    this.setData({ addressList: formattedList });
  },

  onSelectAddress(e) {
    const id = e.currentTarget.dataset.id;
    if (!this.data.isSelectMode) return;
    const address = addressApi.getAddressById(id);
    if (!address) return;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage) prevPage.setData({ selectedAddress: address });
    wx.navigateBack();
  },

  onAdd() { wx.navigateTo({ url: '/pages/address/edit/edit' }); },

  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/address/edit/edit?id=${id}` });
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示', content: '确定要删除该收货地址吗？', confirmColor: '#ff6700',
      success: (res) => {
        if (res.confirm) {
          addressApi.deleteAddress(id);
          this.loadAddressList();
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  },

  onPullDownRefresh() { this.loadAddressList(); wx.stopPullDownRefresh(); }
});