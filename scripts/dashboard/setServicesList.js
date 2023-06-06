import autocomplete from "./autocomplete";

const setServicesList = (e, value, setServices, setData, data, setDate, setHour, setDisabled) => {

    setData({...data, userID: value === null ? '' : value.id})
    if(e.target.value !== undefined) {
        autocomplete('services', value.id, setServices)
        setDate(value.workingDays)

        const arrTime = []
        for(let x = value.shiftStart.split(':')[0]; x <= value.shiftEnd.split(':')[0]; x++)
            arrTime.push(`${x.toString().padStart(2, '0')}:00`)
        setHour(arrTime)

        setDisabled(false)
    }

}
export default setServicesList