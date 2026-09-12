package com.securebank.api.dto;

import java.time.Instant;

public class ApiError {
    private Instant timestamp = Instant.now();
    private int status;
    private String error;
    private String message;
    private String path;

    public ApiError(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public Instant getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }
}
