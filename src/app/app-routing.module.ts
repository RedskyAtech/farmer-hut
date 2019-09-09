import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "homeAdmin", loadChildren: "~/app/home-admin/home-admin.module#HomeAdminModule" },
    { path: "addProduct", loadChildren: "~/app/add-product/add-product.module#AddProductModule" },
    { path: "login", loadChildren: "~/app/login/login.module#LoginModule" },
    { path: "register", loadChildren: "~/app/register/register.module#RegisterModule" },
    { path: "profile", loadChildren: "~/app/profile/profile.module#ProfileModule" },
    { path: "homeUser", loadChildren: "~/app/home-user/home-user.module#HomeUserModule" },
    { path: "forgotPassword", loadChildren: "~/app/forgot-password/forgot-password.module#ForgotPasswordModule" },
    { path: "setPassword", loadChildren: "~/app/set-password/set-password.module#SetPasswordModule" },
    { path: "myOrders", loadChildren: "~/app/my-orders/my-orders.module#MyOrdersModule" },
    { path: "myOrderDetail", loadChildren: "~/app/my-order-detail/my-order-detail.module#MyOrderDetailModule" },
    { path: "viewOrders", loadChildren: "~/app/view-orders/view-orders.module#ViewOrdersModule" },
    { path: "productDetail", loadChildren: "~/app/product-detail/product-detail.module#ProductDetailModule" },
    { path: "cart", loadChildren: "~/app/cart/cart.module#CartModule" },
    { path: "viewFeedback", loadChildren: "~/app/view-feedback/view-feedback.module#ViewFeedbackModule" },
    { path: "giveFeedback", loadChildren: "~/app/give-feedback/give-feedback.module#GiveFeedbackModule" },
    { path: "address", loadChildren: "~/app/address/address.module#AddressModule" },
    { path: "aboutUs", loadChildren: "~/app/about-us/about-us.module#AboutUsModule" },
    { path: "aboutUsAdmin", loadChildren: "~/app/about-us-admin/about-us-admin.module#AboutUsAdminModule" },
    { path: "changePassword", loadChildren: "~/app/change-password/change-password.module#ChangePasswordModule" },
    { path: "orderDetail", loadChildren: "~/app/order-detail/order-detail.module#OrderDetailModule" },
    { path: "similarProductUser", loadChildren: "~/app/similar-productUser/similar-productUser.module#SimilarProductUserModule" },
    { path: "similarProductAdmin", loadChildren: "~/app/similar-productAdmin/similar-productAdmin.module#SimilarProductAdminModule" },
    { path: "addCategory", loadChildren: "~/app/add-category/add-category.module#AddCategoryModule" },
    { path: "addSlider", loadChildren: "~/app/add-slider/add-slider.module#AddSliderModule" },
    { path: "confirmPhone", loadChildren: "~/app/confirm-phone/confirm-phone.module#ConfirmPhoneModule" },
    { path: "orderHistory", loadChildren: "~/app/order-history/order-history.module#OrderHistoryModule" },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
