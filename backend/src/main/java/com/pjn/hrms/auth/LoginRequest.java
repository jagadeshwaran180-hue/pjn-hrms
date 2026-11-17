package com.pjn.hrms.auth;

import java.util.UUID;

public record LoginRequest(String companyCode, String email, String password) {}
