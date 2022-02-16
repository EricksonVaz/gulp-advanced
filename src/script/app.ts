import $ from "jquery";
import { User } from "./user";

(function(){

    function main(){
        $(".app").html("<h1>Gulp 4 Starter packages</h1>")
        console.log(new User("erickson","ericksoncv1@outlook.com"));
    }

    window.addEventListener("load",main);
})();