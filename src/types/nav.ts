/**
 * Created by d.d on 18/07/2017.
 */

const noon = () => {}; 
export class Item {
    name: string;
    title: string;
    path: string;
    event?: () => void;

    constructor(name = '', title = '', path = '/', event = noon) {
        this.name = name;
        this.title = title;
        this.path = path;
        this.event = event;
    }
}
