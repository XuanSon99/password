<template>
  <div class="login">
    <form>
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input type="text" class="form-control" v-model="username" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" v-model="password" />
      </div>
      <button type="submit" @click.prevent="login" class="btn btn-primary">
        Login
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    login() {
      let params = {
        username: this.username,
        password: this.password,
      };
      if (!this.username || !this.password) {
        this.$toast.error("Vui lòng nhập đủ thông tin");
        return;
      }
      this.CallAPI(
        "post",
        "auth/login",
        params,
        (res) => {
          localStorage.setItem("token", res.data.data[0].token);
          localStorage.setItem("user", res.data.data[0].user);
          location.reload();
        },
        (error) => {
          let status = error.response.data.statusCode;
          if (status == 401 || status == 400) {
            this.$toast.error("Tài khoản hoặc mật khẩu không đúng");
          }
        }
      );
    },
  },
};
</script>

<style>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login form {
  width: 400px;
  padding: 30px;
  box-shadow: 4px 4px 10px rgb(202, 202, 202);
  border-radius: 10px;
}
.login button {
  width: 120px;
  margin: 0 auto;
  display: block;
  margin-top: 20px;
}
</style>