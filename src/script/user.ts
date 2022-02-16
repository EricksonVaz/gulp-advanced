export class User{
    constructor(private name:string, private email:string){}

    public getInfo(){
        return `${this.name} -  ${this.email}`;
    }
}