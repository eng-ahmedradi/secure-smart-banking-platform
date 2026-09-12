package com.securebank.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "الاسم الكامل مطلوب")
    private String fullName;

    @NotBlank(message = "اسم المستخدم مطلوب")
    @Size(min = 4, max = 30, message = "اسم المستخدم يجب أن يكون بين 4 و30 حرفاً")
    private String username;

    @NotBlank(message = "كلمة المرور مطلوبة")
    @Size(min = 6, message = "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    private String password;

    @Email(message = "البريد الإلكتروني غير صالح")
    private String email;

    private String phone;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
