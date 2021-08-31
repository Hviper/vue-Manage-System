const Utils = {
    isEquals(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let index = 0; index < keys1.length; index++) {
            if(keys1[index]!==keys2[index]){
                return false;
            }
            if(object1[keys1[index]]!==object2[keys2[index]]){
                return false;
            }
        }

        return true;
    },
}
export default Utils