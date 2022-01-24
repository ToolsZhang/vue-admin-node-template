import Vue from "vue";
import Auth from "./utils/auth";
declare module "vue/types/vue" {
    interface Vue {
        $authJwt: Auth
    }
}