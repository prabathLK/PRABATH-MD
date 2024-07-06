module.exports = {
    convertTime : (hms) => {
        if (hms.length <3){
         return hms
        } else if (hms.length <6){
          const a = hms.split(':')
          return hms = (+a[0]) * 60 + (+a[1])
        } else {
          const a = hms.split(':')
          return hms = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
        }
    }
}