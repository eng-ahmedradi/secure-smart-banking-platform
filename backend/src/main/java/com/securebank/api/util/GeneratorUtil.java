package com.securebank.api.util;

import java.security.SecureRandom;

public class GeneratorUtil {

    private static final SecureRandom RANDOM = new SecureRandom();

    public static String accountNumber() {
        StringBuilder sb = new StringBuilder("4012");
        for (int i = 0; i < 8; i++) sb.append(RANDOM.nextInt(10));
        return sb.toString();
    }

    public static String iban(String accountNumber) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 14; i++) sb.append(RANDOM.nextInt(10));
        String check = String.format("%02d", 10 + RANDOM.nextInt(90));
        return "EG" + check + "0002" + sb;
    }

    public static String cardNumber() {
        StringBuilder sb = new StringBuilder("4490");
        for (int group = 0; group < 3; group++) {
            for (int i = 0; i < 4; i++) sb.append(RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    public static String cvv() {
        return String.format("%03d", RANDOM.nextInt(1000));
    }

    public static String transactionReference() {
        return "TXN-" + (100000 + RANDOM.nextInt(900000));
    }

    public static String otp() {
        return String.format("%06d", RANDOM.nextInt(1000000));
    }
}
