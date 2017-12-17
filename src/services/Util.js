const Util = {
  getDeviceID: () => {
    const nAgt = navigator.userAgent
    let browserName = navigator.appName
    let nameOffset
    let verOffset

    if (nAgt.indexOf('OPR/') !== -1) { // In Opera 15+, the true version is after "OPR/"
      browserName = 'Opera'
    } else if (nAgt.indexOf('Opera') !== -1) { // In older Opera, the true version is after "Opera" or after "Version"
      browserName = 'Opera'
    } else if (nAgt.indexOf('MSIE') !== -1) { // In MSIE, the true version is after "MSIE" in userAgent
      browserName = 'InternetExplorer'
    } else if (nAgt.indexOf('Chrome') !== -1) { // In Chrome, the true version is after "Chrome"
      browserName = 'Chrome'
    } else if (nAgt.indexOf('Safari') !== -1) { // In Safari, the true version is after "Safari" or after "Version"
      browserName = 'Safari'
    } else if (nAgt.indexOf('Firefox') !== -1) { // In Firefox, the true version is after "Firefox"
      browserName = 'Firefox'
    } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) { // In most other browsers, "name/version" is at the end of userAgent
      browserName = nAgt.substring(nameOffset, verOffset)
      if (browserName.toLowerCase() === browserName.toUpperCase()) {
        browserName = navigator.appName
      }
    }

    const guid = `browser-${browserName.toLowerCase()}-${navigator.mimeTypes.length}_${nAgt.replace(/\D+/g, '')}_${navigator.plugins.length}_${screen.height || ''}_${screen.width || ''}_${screen.pixelDepth || ''}`
    console.log('Util.getDeviceID(): ', guid)
    return guid
  },
  findAnyOne: (haystack, arr) => arr.some(v => haystack.indexOf(v) >= 0),
  getAccessibleMenu: () => {
    const accessControlList = localStorage.getItem('accessControlList')

    const menu = []
    if (Util.findAnyOne(accessControlList, [
      'MS_STATIC_RESOURCE_GET_ACCOUNT_CLASS_LIST',
      'MS_STATIC_RESOURCE_GET_ACCOUNT_TYPE_LIST',
      'MS_STATIC_RESOURCE_GET_BANK_LIST',
      'MS_STATIC_RESOURCE_GET_BRANCH_LIST',
      'MS_STATIC_RESOURCE_GET_BUSINESS_TYPE_LIST',
      'MS_STATIC_RESOURCE_GET_COUNTRY_LIST',
      'MS_STATIC_RESOURCE_GET_DISTRICT_LIST',
      'MS_STATIC_RESOURCE_GET_OCCUPATION_LIST',
      'MS_STATIC_RESOURCE_GET_THANA_LIST'
    ])) menu.push('Configuration')

    localStorage.setItem('menu', menu)
    console.log('menu_', menu)
  }
}

export default Util
