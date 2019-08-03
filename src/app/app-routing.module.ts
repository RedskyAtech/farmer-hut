import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { HomeAdminComponent } from "./home-admin/home-admin.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { HomeUserComponent } from "./home-user/home-user.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SetPasswordComponent } from "./set-password/set-password.component";
import { MyOrderDetailComponent } from "./my-order-detail/my-order-detail.component";
import { ViewOrdersComponent } from "./view-orders/view-orders.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { CartComponent } from "./cart/cart.component";
import { ViewFeedbackComponent } from "./view-feedback/view-feedback.component";
import { GiveFeedbackComponent } from "./give-feedback/give-feedback.component";
import { AddressComponent } from "./address/address.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import { SimilarProductUserComponent } from "./similar-productUser/similar-productUser.component";
import { SimilarProductAdminComponent } from "./similar-productAdmin/similar-productAdmin.component";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { AddSliderComponent } from "./add-slider/add-slider.component";
import { MyOrdersComponent } from "./my-orders/my-orders.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { OrderHistoryComponent } from "./order-history/order-history.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "homeAdmin", component: HomeAdminComponent },
    { path: "addProduct", component: AddProductComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "profile", component: ProfileComponent },
    { path: "homeUser", component: HomeUserComponent },
    { path: "forgotPassword", component: ForgotPasswordComponent },
    { path: "setPassword", component: SetPasswordComponent },
    { path: "myOrders", component: MyOrdersComponent },
    { path: "myOrderDetail", component: MyOrderDetailComponent },
    { path: "viewOrders", component: ViewOrdersComponent },
    { path: "productDetail", component: ProductDetailComponent },
    { path: "cart", component: CartComponent },
    { path: "viewFeedback", component: ViewFeedbackComponent },
    { path: "giveFeedback", component: GiveFeedbackComponent },
    { path: "address", component: AddressComponent },
    { path: "aboutUs", component: AboutUsComponent },
    { path: "changePassword", component: ChangePasswordComponent },
    { path: "orderDetail", component: OrderDetailComponent },
    { path: "similarProductUser", component: SimilarProductUserComponent },
    { path: "similarProductAdmin", component: SimilarProductAdminComponent },
    { path: "addCategory", component: AddCategoryComponent },
    { path: "addSlider", component: AddSliderComponent },
    { path: "confirmEmail", component: ConfirmEmailComponent },
    { path: "orderHistory", component: OrderHistoryComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
