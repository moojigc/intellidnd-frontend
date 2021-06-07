export default function getMap<T extends any[]>(array: T, key: keyof T[number], keyIsUnique?: true): Record<string, T[number]>;
export default function getMap<T extends any[]>(array: T, key: keyof T[number], keyIsUnique: false): Record<string, T>;
export default function getMap<T extends any[]>(array: T, key: keyof T[number], keyIsUnique = true) {
    
    const ret: Record<string, any> = {};

    array.forEach(a => {

        if (keyIsUnique) {

            ret[a[key]] = a;
        }
        else {
            
            ret[a[key]] ??= [];
            ret[a[key]].push(a);
        }
    });

    return ret;
}