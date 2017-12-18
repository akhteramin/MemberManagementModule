// import Constants from '../services/Constants';

const Restrict = {
  inserted: (element, binding) => {
    // console.log(localStorage.getItem('token'));
    // console.log(element);
    // console.log(element.children);

    const [service, action] = binding.value.split('|')
    const allowedList = localStorage.accessControlList
    // const serviceList = Constants.ACL;

    if (action === 'MENU') {
      const menuList = localStorage.getItem('menu')
      if (menuList.indexOf(service) === -1) {
        console.log('HIDDEN MENU VIEW', service)
        element.remove()
      }
      return
    }

    // if (allowedList.indexOf(serviceList[service]) === -1) {
    if (allowedList.indexOf(service) === -1) {
      if (action === 'DISABLED') {
        element.disabled = true
      } else {
        // for (let i = 0; i < element.children.length; i += 1) {
        //   element.children[i].remove();
        // }
        element.remove()
      }
      console.log('ACCESS DENIED TO', service)
    }

    console.log('ACCESS ALLOWED TO', service)
  },
  updated: (element, binding) => {
    console.log(localStorage.getItem('token'))
    console.log(element)
    console.log(element.children)

    const [service, action] = binding.value.split('|')
    const allowedList = localStorage.accessControlList
    // const serviceList = Constants.ACL;

    // if (allowedList.indexOf(serviceList[service]) === -1) {
    if (allowedList.indexOf(service) === -1) {
      if (action === 'DISABLED') {
        element.disabled = true
      } else if (action === 'HIDE') {
        element.hide()
      } else {
        // for (let i = 0; i < element.children.length; i += 1) {
        //   element.children[i].remove();
        // }
        element.remove()
      }
      console.log('ACCESS DENIED TO', service)
    }
    console.log('ACCESS ALLOWED TO', service)
  }
}

export default Restrict
