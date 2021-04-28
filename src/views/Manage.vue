<template>
  <div class="manage">
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:item.password="{ item }">
        <v-text-field
          v-model="item.password"
          class="password"
          readonly
          append-outer-icon="mdi-content-copy"
          @click:append-outer="copyPassword"
          id="password"
        />
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
          <v-spacer />
          <router-link to="/">
            <v-btn color="info" dark class="mb-2"> Thêm mới </v-btn>
          </router-link>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.username"
                        label="Username"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.password"
                        label="Mật khẩu"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.note" label="Ghi chú" />
                    </v-col>
                  </v-row>
                  <v-alert type="warning" dense border="left" v-if="error">
                    {{ error }}
                  </v-alert>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="close"> Hủy </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Lưu </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">
                Bạn có chắc chắn muốn xóa?
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="closeDelete">
                  Hủy
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                  Xóa
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Username",
        align: "start",
        value: "username",
      },
      {
        text: "Password",
        align: "start",
        value: "password",
      },
      {
        text: "Ghi chú",
        align: "start",
        value: "note",
      },
      {
        text: "Hành động",
        value: "actions",
        sortable: false,
      },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      password: "",
      username: "",
      note: "",
    },
    defaultItem: {
      password: "",
      username: "",
      note: "",
    },
    error: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm mới" : "Sửa";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.desserts = [];
      this.CallAPI("get", "account", {}, (response) => {
        for (let item of response.data.data) {
          this.desserts.push({
            username: item.username,
            password: item.password.slice(0, 16),
            _id: item._id,
            note: item.note,
          });
        }
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-GB");
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.closeDelete();
      this.CallAPI(
        "delete",
        "account/" + this.desserts[this.editedIndex]._id,
        {},
        (response) => {
          this.$toast.success("Xóa thành công");
          this.getList();
        },
        (error) => {
          this.$toast.error("Không thành công");
        }
      );
    },

    close() {
      this.error = "";
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (
        !this.editedItem.username ||
        !this.editedItem.note ||
        !this.editedItem.password
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "account/" + this.desserts[this.editedIndex]._id,
          this.editedItem,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Không thành công";
          }
        );
      }
    },
    copyPassword() {
      var copyText = document.getElementById("password");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.$toast.success("Copy thành công");
    },
  },
};
</script>
