import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeAdminComponent } from "./home-admin/home-admin.component"
import { GridViewModule } from "nativescript-grid-view/angular";
import { AddProductComponent } from "./add-product/add-product.component";
import { NgModalModule } from "./modals/ng-modal";
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from "@angular/common/http";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { HomeUserComponent } from "./home-user/home-user.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { MyOrderDetailComponent } from "./my-order-detail/my-order-detail.component";
import { ViewOrdersComponent } from "./view-orders/view-orders.component";
import { UserService } from "./services/user.service";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { CartComponent } from "./cart/cart.component";
import { ViewFeedbackComponent } from "./view-feedback/view-feedback.component";
import { GiveFeedbackComponent } from "./give-feedback/give-feedback.component";
import { AddressComponent } from "./address/address.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { SimilarProductAdminComponent } from "./similar-productAdmin/similar-productAdmin.component";
import { SimilarProductUserComponent } from "./similar-productUser/similar-productUser.component";
import { AddSliderComponent } from "./add-slider/add-slider.component";
import { MyOrdersComponent } from "./my-orders/my-orders.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { OrderHistoryComponent } from "./order-history/order-history.component";
import { SetPasswordComponent } from "./set-password/set-password.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        GridViewModule,
        NgModalModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        HomeAdminComponent,
        AddProductComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        HomeUserComponent,
        ForgotPasswordComponent,
        SetPasswordComponent,
        MyOrdersComponent,
        MyOrderDetailComponent,
        ViewOrdersComponent,
        ProductDetailComponent,
        CartComponent,
        ViewFeedbackComponent,
        GiveFeedbackComponent,
        AddressComponent,
        AboutUsComponent,
        ChangePasswordComponent,
        OrderDetailComponent,
        AddCategoryComponent,
        SimilarProductAdminComponent,
        SimilarProductUserComponent,
        AddSliderComponent,
        ConfirmEmailComponent,
        OrderHistoryComponent
    ],
    providers: [UserService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
