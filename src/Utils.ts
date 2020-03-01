import Log from "@yadou/yalog";
type dataObject = Object[] | Object;
export default class Utils {

    static getMapFromList ( arrList: dataObject, mapKey ) {
        let mapList = {};
        for ( let key in arrList ) {
            if ( !arrList.hasOwnProperty( key ) ) {
                continue;
            }
            let record = arrList[ key ];
            if ( !record[ mapKey ] ) {
                Log.warning('record has no mapKey', {mapKey} );
                continue;
            }
            mapList[ record[ mapKey ] ] = record;
        }
        return mapList;
    }

    static getFieldValue( arrList: dataObject, mapKey, bolUnique = true ) {
        let values = [];
        Object.values( arrList ).map( ( record ) => {
            if ( record[ mapKey ] !== undefined ) {
                values.push( record[ mapKey ] );
            }
        } )
        if ( bolUnique ) {
            let set = new Set( values );
            return set.values();
        }
        return values;
    }

    static getFieldArray( arrList: dataObject, mapKey ) {
        let mapList = {};
        let mapKeyValue;
        Object.values( arrList ).map( ( record ) => {
            mapKeyValue = record[ mapKey ];
            if ( mapKeyValue === undefined ) {
                return ;
            }
            if ( !mapList[ mapKeyValue ] ) {
                mapList[ mapKeyValue ] = [];
            }
            mapList[ mapKeyValue ].push( record );
        } )
        return mapList;
    }

    static getMapFieldValue( arrList: dataObject, mapField, mapKey = 'id' ) {
        let mapValue = {};
        Object.values( arrList ).map( ( record ) => {
            if ( record[ mapKey ] !== undefined && record[ mapField ] !== undefined ) {
                mapValue[ record[ mapKey ] ] = record[ mapField ];
            }
        } )
        return mapValue;
    }
}