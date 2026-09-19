/**
 * 收货地址工具模块
 * 使用 wx.Storage 模拟本地数据持久化
 */

const STORAGE_KEY = 'USER_ADDRESS_LIST';

function getAddressList() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

function saveAddressList(list) {
  wx.setStorageSync(STORAGE_KEY, list);
}

function getAddressById(id) {
  const list = getAddressList();
  return list.find(item => item.id === id) || null;
}

function saveAddress(address) {
  const list = getAddressList();
  if (address.id) {
    const index = list.findIndex(item => item.id === address.id);
    if (index > -1) list[index] = { ...list[index], ...address };
  } else {
    address.id = 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    address.createTime = Date.now();
    list.unshift(address);
  }
  if (address.isDefault) {
    list.forEach(item => { if (item.id !== address.id) item.isDefault = false; });
  }
  saveAddressList(list);
  return address;
}

function deleteAddress(id) {
  let list = getAddressList();
  list = list.filter(item => item.id !== id);
  saveAddressList(list);
}

function setDefaultAddress(id) {
  const list = getAddressList();
  list.forEach(item => { item.isDefault = item.id === id; });
  saveAddressList(list);
}

function getDefaultAddress() {
  const list = getAddressList();
  return list.find(item => item.isDefault) || null;
}

function validateAddress(address) {
  if (!address.name || !address.name.trim()) return '请输入收货人姓名';
  if (!address.phone || !/^1[3-9]\d{9}$/.test(address.phone)) return '请输入正确的手机号码';
  if (!address.region || !address.region.length || address.region.length < 3) return '请选择所在地区';
  if (!address.detail || !address.detail.trim()) return '请输入详细收货地址';
  return null;
}

module.exports = {
  getAddressList, getAddressById, saveAddress,
  deleteAddress, setDefaultAddress, getDefaultAddress, validateAddress
};
