# NOSTOS Integration Testing Script

## 🧪 Manual Testing Checklist

### Prerequisites
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] PostgreSQL database configured
- [ ] .env files configured in both frontend and backend

---

## Test 1: Backend Health Check

```powershell
# Test backend is accessible
curl http://localhost:8000/api/campaigns/statistics/

# Expected: JSON response with statistics
# {
#   "total_campaigns": 0,
#   "active_campaigns": 0,
#   "completed_campaigns": 0,
#   "total_raised": 0
# }
```

**Result**: ✅ / ❌

---

## Test 2: User Registration

### Steps:
1. Open http://localhost:3000/register
2. Fill in the form:
   - Name: Test User
   - Email: test@nostos.com
   - Graduation Year: 2020
   - Department: Computer Science
   - Phone: +1234567890
   - Password: TestPass123!
   - Confirm Password: TestPass123!
3. Click "Create Account"

### Expected:
- ✅ Success message appears
- ✅ Auto-redirect to /alumni/dashboard after 2 seconds
- ✅ localStorage contains: `access_token`, `refresh_token`, `user`

### Verify in Backend:
```powershell
# Django shell
python manage.py shell

# Check user was created
from users.models import User
User.objects.filter(email='test@nostos.com').exists()
# Should return: True
```

**Result**: ✅ / ❌

---

## Test 3: User Login

### Steps:
1. Clear localStorage (DevTools → Application → Local Storage → Clear)
2. Open http://localhost:3000/login
3. Enter credentials:
   - Email: test@nostos.com
   - Password: TestPass123!
   - Role: Alumni
4. Click "Sign In"

### Expected:
- ✅ Redirect to /alumni/dashboard
- ✅ localStorage contains tokens
- ✅ No errors in console

### Check Network Tab:
- ✅ POST request to /api/users/login/
- ✅ Status: 200 OK
- ✅ Response contains: `access`, `refresh`, `user`

**Result**: ✅ / ❌

---

## Test 4: Admin Login

### Steps:
1. Logout current user
2. Open http://localhost:3000/login
3. Enter admin credentials:
   - Email: admin@nostos.com (create via `python manage.py createsuperuser`)
   - Password: your-admin-password
   - Role: Admin
4. Click "Sign In"

### Expected:
- ✅ Redirect to /admin/dashboard
- ✅ User role is 'admin'

**Result**: ✅ / ❌

---

## Test 5: Logout

### Steps:
1. While logged in, navigate to http://localhost:3000/logout

### Expected:
- ✅ "Logging out..." animation appears
- ✅ Countdown from 3 to 1
- ✅ Redirect to home page (/)
- ✅ localStorage is cleared
- ✅ POST request to /api/users/logout/

**Result**: ✅ / ❌

---

## Test 6: Token Refresh

### Steps:
1. Login to get tokens
2. Open DevTools → Application → Local Storage
3. Copy `access_token`
4. Set expiration to past (manually modify token payload in JWT.io)
5. Make an API call (e.g., view profile)

### Expected:
- ✅ Automatic token refresh
- ✅ New `access_token` in localStorage
- ✅ API call succeeds
- ✅ POST request to /api/token/refresh/

**Result**: ✅ / ❌

---

## Test 7: Protected Routes

### Steps:
1. Logout (clear all tokens)
2. Try accessing protected routes directly:
   - http://localhost:3000/alumni/dashboard
   - http://localhost:3000/admin/dashboard
   - http://localhost:3000/profile

### Expected:
- ✅ Redirect to /login
- OR
- ✅ Error message "Please login"

**Result**: ✅ / ❌

---

## Test 8: Campaign Listing

### Steps:
1. Create campaigns via Django admin: http://localhost:8000/admin
2. Open http://localhost:3000/campaigns

### Expected:
- ✅ Campaigns displayed from backend
- ✅ GET request to /api/campaigns/
- ✅ Data matches backend

**Result**: ✅ / ❌

---

## Test 9: API Error Handling

### Steps:
1. Stop the backend server
2. Try to login

### Expected:
- ✅ Error message: "Unable to connect to server"
- ✅ No app crash
- ✅ User-friendly error display

**Result**: ✅ / ❌

---

## Test 10: CORS Configuration

### Steps:
1. Open DevTools → Console
2. Login or make any API call

### Expected:
- ✅ No CORS errors
- ✅ Requests from localhost:3000 → localhost:8000 work

**Result**: ✅ / ❌

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**:
- Check backend `settings.py`:
  ```python
  CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
  ```
- Restart Django server

### Issue: 401 Unauthorized
**Solution**:
- Check token in localStorage
- Try logout and login again
- Verify backend JWT settings

### Issue: Connection Refused
**Solution**:
- Ensure backend is running: `python manage.py runserver`
- Check port 8000 is free
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Issue: "Import could not be resolved"
**Solution**:
- In frontend: `npm install`
- In backend: `pip install -r requirements.txt`

---

## 📊 Test Summary

| Test | Status | Notes |
|------|--------|-------|
| Backend Health | ⬜ | |
| User Registration | ⬜ | |
| User Login | ⬜ | |
| Admin Login | ⬜ | |
| Logout | ⬜ | |
| Token Refresh | ⬜ | |
| Protected Routes | ⬜ | |
| Campaign Listing | ⬜ | |
| Error Handling | ⬜ | |
| CORS | ⬜ | |

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Update Remaining Pages**:
   - Campaign details
   - Donation flow
   - Profile management
   - Dashboard data loading
   - AI features
   - Analytics

2. **Add Loading States**:
   ```typescript
   const [loading, setLoading] = useState(true);
   
   if (loading) return <div>Loading...</div>;
   ```

3. **Add Error Boundaries**:
   ```typescript
   const [error, setError] = useState('');
   
   if (error) return <div>Error: {error}</div>;
   ```

4. **Implement Real-time Updates**:
   - WebSocket for live campaign updates
   - Polling for statistics refresh

5. **Add Payment Integration**:
   - Razorpay/Stripe integration
   - Payment confirmation flow

6. **Testing**:
   - Write Jest tests for API client
   - E2E tests with Playwright/Cypress

---

**Happy Testing! 🎉**
