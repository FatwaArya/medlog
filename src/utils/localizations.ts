import { LocalizationResource } from "@clerk/types";

const commonTexts = {
  signIn: {
    phoneCode: {
      title: "Check your phone",
      subtitle: "to continue to {{applicationName}}",
      formTitle: "Verification code",
      formSubtitle: "Enter the verification code sent to your phone number",
      resendButton: "Didn't receive a code? Resend",
    },
  },
} as const;

export const idIDN: LocalizationResource = {
  locale: "id-ID",
  socialButtonsBlockButton: "Lanjut dengan {{provider|titleize}}",
  dividerText: "atau",
  formFieldLabel__emailAddress: "Alamat email",
  formFieldLabel__emailAddresses: "Alamat email",
  formFieldLabel__phoneNumber: "Nomor telepon",
  formFieldLabel__username: "Username",
  formFieldLabel__emailAddress_phoneNumber: "Alamat email atau nomor telepon",
  formFieldLabel__emailAddress_username: "Alamat email atau username",
  formFieldLabel__phoneNumber_username: "Nomor telepon atau username",
  formFieldLabel__emailAddress_phoneNumber_username:
    "Alamat email, nomor telepon, atau username",
  formFieldLabel__password: "Password",
  formFieldLabel__currentPassword: "Password saat ini",
  formFieldLabel__newPassword: "Password baru",
  formFieldLabel__confirmPassword: "Konfirmasi password",
  formFieldLabel__signOutOfOtherSessions: "Keluar dari semua perangkat lain",
  formFieldLabel__automaticInvitations:
    "Enable automatic invitations for this domain",
  formFieldLabel__firstName: "Nama depan",
  formFieldLabel__lastName: "Nama belakang",
  formFieldLabel__backupCode: "Backup code",
  formFieldLabel__organizationName: "Nama Organisasi",
  formFieldLabel__organizationSlug: "Slug URL",
  formFieldLabel__organizationDomain: "Domain",
  formFieldLabel__organizationDomainEmailAddress: "Verifikasi email",
  formFieldLabel__organizationDomainEmailAddressDescription:
    "Enter an email address under this domain to receive a code and verify this domain.",
  formFieldLabel__organizationDomainDeletePending:
    "Delete pending invitations and suggestions",
  formFieldLabel__confirmDeletion: "Confirmation",
  formFieldLabel__role: "Role",
  formFieldInputPlaceholder__emailAddress: "",
  formFieldInputPlaceholder__emailAddresses:
    "Enter or paste one or more email addresses, separated by spaces or commas",
  formFieldInputPlaceholder__phoneNumber: "",
  formFieldInputPlaceholder__username: "",
  formFieldInputPlaceholder__emailAddress_phoneNumber: "",
  formFieldInputPlaceholder__emailAddress_username: "",
  formFieldInputPlaceholder__phoneNumber_username: "",
  formFieldInputPlaceholder__emailAddress_phoneNumber_username: "",
  formFieldInputPlaceholder__password: "",
  formFieldInputPlaceholder__firstName: "",
  formFieldInputPlaceholder__lastName: "",
  formFieldInputPlaceholder__backupCode: "",
  formFieldInputPlaceholder__organizationName: "",
  formFieldInputPlaceholder__organizationSlug: "",
  formFieldInputPlaceholder__organizationDomain: "",
  formFieldInputPlaceholder__organizationDomainEmailAddress: "",
  formFieldError__notMatchingPasswords: `Password tidak cocok`,
  formFieldError__matchingPasswords: "Password cocok",
  formFieldAction__forgotPassword: "Lupa password?",
  formFieldHintText__optional: "Opsional",
  formButtonPrimary: "Lanjut",
  signInEnterPasswordTitle: "Masukkan password",
  backButton: "Back",
  footerActionLink__useAnotherMethod: "Gunakan metode lain",
  badge__primary: "Primary",
  badge__thisDevice: "This device",
  badge__userDevice: "User device",
  badge__otherImpersonatorDevice: "Other impersonator device",
  badge__default: "Default",
  badge__unverified: "Unverified",
  badge__requiresAction: "Requires action",
  badge__you: "You",
  footerPageLink__help: "Help",
  footerPageLink__privacy: "Privacy",
  footerPageLink__terms: "Terms",
  paginationButton__previous: "Previous",
  paginationButton__next: "Next",
  paginationRowText__displaying: "Displaying",
  paginationRowText__of: "of",
  membershipRole__admin: "Admin",
  membershipRole__basicMember: "Member",
  membershipRole__guestMember: "Guest",
  signUp: {
    start: {
      title: "Buat akun",
      subtitle: "Lanjut ke {{applicationName}}",
      actionText: "Sudah punya akun?",
      actionLink: "Masuk",
    },
    emailLink: {
      title: "Verifikasi email",
      subtitle: "Lanjut ke{{applicationName}}",
      formTitle: "Link verifikasi",
      formSubtitle: "Gunakan link verifikasi yang dikirim ke email Anda",
      resendButton: "Tidak menerima link? Kirim ulang",
      verified: {
        title: "Berhasil masuk",
      },
      loading: {
        title: "Masuk...",
      },
      verifiedSwitchTab: {
        title: "Berhasil masuk",
        subtitle: "Kembali ke tab sebelumnya untuk melanjutkan",
        subtitleNewTab: "Kembali ke tab baru yang dibuka untuk melanjutkan",
      },
    },
    emailCode: {
      title: "Verifikasi email",
      subtitle: "Lanjut ke {{applicationName}}",
      formTitle: "Kode verifikasi",
      formSubtitle: "Masukkan kode verifikasi yang dikirim ke email Anda",
      resendButton: "Tidak menerima kode? Kirim ulang",
    },
    phoneCode: {
      title: "Verifikasi nomor telepon",
      subtitle: "Lanjut ke {{applicationName}}",
      formTitle: "Kode verifikasi",
      formSubtitle: "Enter the verification code sent to your phone number",
      resendButton: "Tidak menerima kode? Kirim ulang",
    },
    continue: {
      title: "Isi informasi akun",
      subtitle: "Lanjut ke {{applicationName}}",
      actionText: "Sudah punya akun?",
      actionLink: "Sign in",
    },
  },
  signIn: {
    start: {
      title: "Masuk",
      subtitle: "untuk melanjutkan ke {{applicationName}}",
      actionText: "Belum punya akun?",
      actionLink: "Daftar",
      actionLink__use_email: "Gunakan email",
      actionLink__use_phone: "Gunakan nomor telepon",
      actionLink__use_username: "Gunakan nama pengguna",
      actionLink__use_email_username: "Gunakan email atau nama pengguna",
    },
    password: {
      title: "Masukkan kata sandi Anda",
      subtitle: "untuk melanjutkan ke {{applicationName}}",
      actionLink: "Gunakan metode lain",
    },
    forgotPasswordAlternativeMethods: {
      title: "Lupa Kata Sandi?",
      label__alternativeMethods: "Atau, masuk dengan metode lain.",
      blockButton__resetPassword: "Atur ulang kata sandi Anda",
    },
    forgotPassword: {
      title_email: "Periksa email Anda",
      title_phone: "Periksa telepon Anda",
      subtitle: "untuk mengatur ulang kata sandi Anda",
      formTitle: "Kode pengaturan ulang kata sandi",
      formSubtitle_email: "Masukkan kode yang dikirimkan ke alamat email Anda",
      formSubtitle_phone: "Masukkan kode yang dikirimkan ke nomor telepon Anda",
      resendButton: "Tidak menerima kode? Kirim ulang",
    },
    resetPassword: {
      title: "Atur Ulang Kata Sandi",
      formButtonPrimary: "Atur Ulang Kata Sandi",
      successMessage:
        "Kata sandi Anda berhasil diubah. Sedang masuk, harap tunggu sebentar.",
    },
    resetPasswordMfa: {
      detailsLabel:
        "Kami perlu memverifikasi identitas Anda sebelum mengatur ulang kata sandi Anda.",
    },
    emailCode: {
      title: "Periksa email Anda",
      subtitle: "untuk melanjutkan ke {{applicationName}}",
      formTitle: "Kode verifikasi",
      formSubtitle:
        "Masukkan kode verifikasi yang dikirimkan ke alamat email Anda",
      resendButton: "Tidak menerima kode? Kirim ulang",
    },
    emailLink: {
      title: "Periksa email Anda",
      subtitle: "untuk melanjutkan ke {{applicationName}}",
      formTitle: "Tautan verifikasi",
      formSubtitle: "Gunakan tautan verifikasi yang dikirimkan ke email Anda",
      resendButton: "Tidak menerima tautan? Kirim ulang",
      unusedTab: {
        title: "Anda dapat menutup tab ini",
      },
      verified: {
        title: "Berhasil masuk",
        subtitle: "Anda akan diarahkan segera",
      },
      verifiedSwitchTab: {
        subtitle: "Kembali ke tab asli untuk melanjutkan",
        titleNewTab: "Masuk di tab lain",
        subtitleNewTab: "Kembali ke tab yang baru dibuka untuk melanjutkan",
      },
      loading: {
        title: "Masuk...",
        subtitle: "Anda akan diarahkan segera",
      },
      failed: {
        title: "Tautan verifikasi ini tidak valid",
        subtitle: "Kembali ke tab asli untuk melanjutkan.",
      },
      expired: {
        title: "Tautan verifikasi ini telah kedaluwarsa",
        subtitle: "Kembali ke tab asli untuk melanjutkan.",
      },
    },
    phoneCode: { ...commonTexts.signIn.phoneCode },
    phoneCodeMfa: { ...commonTexts.signIn.phoneCode, subtitle: "" },
    totpMfa: {
      title: "Verifikasi dua langkah",
      subtitle: "",
      formTitle: "Kode verifikasi",
      formSubtitle:
        "Masukkan kode verifikasi yang dihasilkan oleh aplikasi otentikasi Anda",
    },
    backupCodeMfa: {
      title: "Masukkan kode cadangan",
      subtitle: "untuk melanjutkan ke {{applicationName}}",
      formTitle: "",
      formSubtitle: "",
    },
    alternativeMethods: {
      title: "Gunakan metode lain",
      actionLink: "Dapatkan bantuan",
      blockButton__emailLink: "Kirim tautan ke {{identifier}}",
      blockButton__emailCode: "Kirim kode melalui email ke {{identifier}}",
      blockButton__phoneCode: "Kirim kode SMS ke {{identifier}}",
      blockButton__password: "Masuk dengan kata sandi Anda",
      blockButton__totp: "Gunakan aplikasi otentikasi Anda",
      blockButton__backupCode: "Gunakan kode cadangan",
      getHelp: {
        title: "Dapatkan bantuan",
        content: `Jika Anda mengalami kesulitan masuk ke akun Anda, kirimkan email kepada kami, dan kami akan bekerja sama dengan Anda untuk mengembalikan akses secepat mungkin.`,
        blockButton__emailSupport: "Dukungan melalui email",
      },
    },
    noAvailableMethods: {
      title: "Tidak dapat masuk",
      subtitle: "Terjadi kesalahan",
      message:
        "Tidak dapat melanjutkan masuk. Tidak ada faktor otentikasi yang tersedia.",
    },
  },
  userProfile: {
    mobileButton__menu: "Menu",
    formButtonPrimary__continue: "Lanjut",
    formButtonPrimary__finish: "Selesai",
    formButtonReset: "Batal",
    start: {
      headerTitle__account: "Akun",
      headerTitle__security: "Keamanan",
      headerSubtitle__account: "Kelola informasi akun Anda",
      headerSubtitle__security: "Kelola preferensi keamanan Anda",
      profileSection: {
        title: "Profil",
      },
      usernameSection: {
        title: "Nama Pengguna",
        primaryButton__changeUsername: "Ubah nama pengguna",
        primaryButton__setUsername: "Atur nama pengguna",
      },
      emailAddressesSection: {
        title: "Alamat Email",
        primaryButton: "Tambah alamat email",
        detailsTitle__primary: "Alamat email utama",
        detailsSubtitle__primary: "Alamat email ini adalah alamat email utama",
        detailsAction__primary: "Verifikasi lengkap",
        detailsTitle__nonPrimary: "Atur sebagai alamat email utama",
        detailsSubtitle__nonPrimary:
          "Atur alamat email ini sebagai alamat utama untuk menerima komunikasi mengenai akun Anda.",
        detailsAction__nonPrimary: "Atur sebagai utama",
        detailsTitle__unverified: "Alamat email belum terverifikasi",
        detailsSubtitle__unverified:
          "Alamat email ini belum terverifikasi dan mungkin memiliki fungsi terbatas",
        detailsAction__unverified: "Verifikasi lengkap",
        destructiveActionTitle: "Hapus",
        destructiveActionSubtitle:
          "Hapus alamat email ini dan hapus dari akun Anda",
        destructiveAction: "Hapus alamat email",
      },
      phoneNumbersSection: {
        title: "Nomor Telepon",
        primaryButton: "Tambah nomor telepon",
        detailsTitle__primary: "Nomor telepon utama",
        detailsSubtitle__primary:
          "Nomor telepon ini adalah nomor telepon utama",
        detailsAction__primary: "Verifikasi lengkap",
        detailsTitle__nonPrimary: "Atur sebagai nomor telepon utama",
        detailsSubtitle__nonPrimary:
          "Atur nomor telepon ini sebagai nomor utama untuk menerima komunikasi mengenai akun Anda.",
        detailsAction__nonPrimary: "Atur sebagai utama",
        detailsTitle__unverified: "Nomor telepon belum terverifikasi",
        detailsSubtitle__unverified:
          "Nomor telepon ini belum terverifikasi dan mungkin memiliki fungsi terbatas",
        detailsAction__unverified: "Verifikasi lengkap",
        destructiveActionTitle: "Hapus",
        destructiveActionSubtitle:
          "Hapus nomor telepon ini dan hapus dari akun Anda",
        destructiveAction: "Hapus nomor telepon",
      },
      connectedAccountsSection: {
        title: "Akun Terhubung",
        primaryButton: "Hubungkan akun",
        title__conectionFailed: "Coba koneksi ulang yang gagal",
        title__connectionFailed: "Coba koneksi ulang yang gagal",
        title__reauthorize: "Diperlukan otorisasi ulang",
        subtitle__reauthorize:
          "Lingkup yang diperlukan telah diperbarui, dan Anda mungkin mengalami fungsi terbatas. Harap otorisasi ulang aplikasi ini untuk menghindari masalah.",
        actionLabel__conectionFailed: "Coba lagi",
        actionLabel__connectionFailed: "Coba lagi",
        actionLabel__reauthorize: "Otorisasi sekarang",
        destructiveActionTitle: "Hapus",
        destructiveActionSubtitle: "Hapus akun terhubung ini dari akun Anda",
        destructiveActionAccordionSubtitle: "Hapus akun terhubung",
      },
      enterpriseAccountsSection: {
        title: "Akun Enterprise",
      },
      passwordSection: {
        title: "Kata Sandi",
        primaryButton__changePassword: "Ubah kata sandi",
        primaryButton__setPassword: "Atur kata sandi",
      },
      mfaSection: {
        title: "Verifikasi Dua Langkah",
        primaryButton: "Tambah verifikasi dua langkah",
        phoneCode: {
          destructiveActionTitle: "Hapus",
          destructiveActionSubtitle:
            "Hapus nomor telepon ini dari metode verifikasi dua langkah",
          destructiveActionLabel: "Hapus nomor telepon",
          title__default: "Faktor default",
          title__setDefault: "Atur sebagai faktor default",
          subtitle__default:
            "Faktor ini akan digunakan sebagai metode verifikasi dua langkah default saat masuk.",
          subtitle__setDefault:
            "Atur faktor ini sebagai faktor default untuk menggunakannya sebagai metode verifikasi dua langkah default saat masuk.",
          actionLabel__setDefault: "Atur sebagai default",
        },
        backupCodes: {
          headerTitle: "Kode Cadangan",
          title__regenerate: "Regenerasi kode cadangan",
          subtitle__regenerate:
            "Dapatkan set kode cadangan yang aman. Kode cadangan sebelumnya akan dihapus dan tidak dapat digunakan.",
          actionLabel__regenerate: "Regenerasi kode",
        },
        totp: {
          headerTitle: "Aplikasi Otentikasi",
          title: "Faktor default",
          subtitle:
            "Faktor ini akan digunakan sebagai metode verifikasi dua langkah default saat masuk.",
          destructiveActionTitle: "Hapus",
          destructiveActionSubtitle:
            "Hapus aplikasi otentikasi dari metode verifikasi dua langkah",
          destructiveActionLabel: "Hapus aplikasi otentikasi",
        },
      },
      activeDevicesSection: {
        title: "Perangkat Aktif",
        primaryButton: "Perangkat Aktif",
        detailsTitle: "Perangkat saat ini",
        detailsSubtitle: "Ini adalah perangkat yang sedang Anda gunakan",
        destructiveActionTitle: "Keluar",
        destructiveActionSubtitle: "Keluar dari akun Anda pada perangkat ini",
        destructiveAction: "Keluar dari perangkat",
      },
      web3WalletsSection: {
        title: "Dompet Web3",
        primaryButton: "Dompet Web3",
        destructiveActionTitle: "Hapus",
        destructiveActionSubtitle: "Hapus dompet Web3 ini dari akun Anda",
        destructiveAction: "Hapus dompet",
      },
      dangerSection: {
        title: "Bahaya",
        deleteAccountButton: "Hapus Akun",
        deleteAccountTitle: "Hapus Akun",
        deleteAccountDescription: "Hapus akun Anda dan semua data terkaitnya",
      },
    },
    profilePage: {
      title: "Perbarui Profil",
      imageFormTitle: "Gambar Profil",
      imageFormSubtitle: "Unggah gambar",
      imageFormDestructiveActionSubtitle: "Hapus gambar",
      fileDropAreaTitle: "Seret file di sini, atau...",
      fileDropAreaAction: "Pilih file",
      fileDropAreaHint:
        "Unggah gambar JPG, PNG, GIF, atau WEBP dengan ukuran kurang dari 10 MB",
      readonly:
        "Informasi profil Anda telah disediakan oleh koneksi perusahaan dan tidak dapat diedit.",
      successMessage: "Profil Anda telah diperbarui.",
    },
    usernamePage: {
      title: "Perbarui Nama Pengguna",
      successMessage: "Nama pengguna Anda telah diperbarui.",
    },
    emailAddressPage: {
      title: "Tambah Alamat Email",
      emailCode: {
        formHint:
          "Email berisi kode verifikasi akan dikirimkan ke alamat email ini.",
        formTitle: "Kode verifikasi",
        formSubtitle:
          "Masukkan kode verifikasi yang dikirimkan ke {{identifier}}",
        resendButton: "Tidak menerima kode? Kirim ulang",
        successMessage: "Email {{identifier}} telah ditambahkan ke akun Anda.",
      },
      emailLink: {
        formHint:
          "Email berisi tautan verifikasi akan dikirimkan ke alamat email ini.",
        formTitle: "Tautan verifikasi",
        formSubtitle:
          "Klik tautan verifikasi dalam email yang dikirimkan ke {{identifier}}",
        resendButton: "Tidak menerima tautan? Kirim ulang",
        successMessage: "Email {{identifier}} telah ditambahkan ke akun Anda.",
      },
      removeResource: {
        title: "Hapus Alamat Email",
        messageLine1: "{{identifier}} akan dihapus dari akun ini.",
        messageLine2:
          "Anda tidak akan dapat masuk menggunakan alamat email ini lagi.",
        successMessage: "{{emailAddress}} telah dihapus dari akun Anda.",
      },
    },
    phoneNumberPage: {
      title: "Tambah Nomor Telepon",
      successMessage: "{{identifier}} telah ditambahkan ke akun Anda.",
      infoText:
        "Sebuah pesan teks berisi tautan verifikasi akan dikirimkan ke nomor telepon ini.",
      infoText__secondary: "Biaya pesan dan data mungkin berlaku.",
      removeResource: {
        title: "Hapus Nomor Telepon",
        messageLine1: "{{identifier}} akan dihapus dari akun ini.",
        messageLine2:
          "Anda tidak akan dapat masuk menggunakan nomor telepon ini lagi.",
        successMessage: "{{phoneNumber}} telah dihapus dari akun Anda.",
      },
    },
    connectedAccountPage: {
      title: "Tambah Akun Terhubung",
      formHint: "Pilih penyedia untuk menghubungkan akun Anda.",
      formHint__noAccounts: "Tidak ada penyedia akun eksternal yang tersedia.",
      socialButtonsBlockButton: "Hubungkan akun {{provider|titleize}}",
      successMessage: "Penyedia telah ditambahkan ke akun Anda",
      removeResource: {
        title: "Hapus Akun Terhubung",
        messageLine1: "{{identifier}} akan dihapus dari akun ini.",
        messageLine2:
          "Anda tidak akan dapat menggunakan akun terhubung ini lagi dan fitur yang tergantung padanya tidak akan berfungsi lagi.",
        successMessage: "{{connectedAccount}} telah dihapus dari akun Anda.",
      },
    },
    web3WalletPage: {
      title: "Tambah Dompet Web3",
      subtitle__availableWallets:
        "Pilih dompet Web3 untuk menghubungkannya ke akun Anda.",
      subtitle__unavailableWallets: "Tidak ada dompet Web3 yang tersedia.",
      successMessage: "Dompet telah ditambahkan ke akun Anda.",
      removeResource: {
        title: "Hapus Dompet Web3",
        messageLine1: "{{identifier}} akan dihapus dari akun ini.",
        messageLine2:
          "Anda tidak akan dapat masuk menggunakan dompet Web3 ini lagi.",
        successMessage: "{{web3Wallet}} telah dihapus dari akun Anda.",
      },
    },
    passwordPage: {
      title: "Atur Kata Sandi",
      changePasswordTitle: "Ubah Kata Sandi",
      readonly:
        "Kata sandi Anda saat ini tidak dapat diubah karena Anda hanya dapat masuk melalui koneksi perusahaan.",
      successMessage: "Kata sandi Anda telah diatur.",
      changePasswordSuccessMessage: "Kata sandi Anda telah diperbarui.",
      sessionsSignedOutSuccessMessage: "Semua perangkat lain telah keluar.",
    },
    mfaPage: {
      title: "Tambah Verifikasi Dua Langkah",
      formHint: "Pilih metode untuk ditambahkan.",
    },
    mfaTOTPPage: {
      title: "Tambah Aplikasi Otentikasi",
      verifyTitle: "Kode Verifikasi",
      verifySubtitle:
        "Masukkan kode verifikasi yang dihasilkan oleh aplikasi otentikasi Anda",
      successMessage:
        "Verifikasi dua langkah kini aktif. Saat masuk, Anda perlu memasukkan kode verifikasi dari aplikasi otentikasi ini sebagai langkah tambahan.",
      authenticatorApp: {
        infoText__ableToScan:
          "Atur metode masuk baru dalam aplikasi otentikasi Anda dan pindai kode QR berikut untuk menghubungkannya dengan akun Anda.",
        infoText__unableToScan:
          "Atur metode masuk baru dalam otentikasi Anda dan masukkan Kunci yang disediakan di bawah ini.",
        inputLabel__unableToScan1:
          "Pastikan waktu berbasis atau sandi satu kali diaktifkan, lalu selesaikan penghubungan akun Anda.",
        inputLabel__unableToScan2:
          "Alternatifnya, jika otentikasi Anda mendukung URI TOTP, Anda juga dapat menyalin URI lengkap.",
        buttonAbleToScan__nonPrimary: "Pindai kode QR saja",
        buttonUnableToScan__nonPrimary: "Tidak bisa memindai kode QR?",
      },
      removeResource: {
        title: "Hapus Verifikasi Dua Langkah",
        messageLine1:
          "Kode verifikasi dari aplikasi otentikasi ini tidak lagi diperlukan saat masuk.",
        messageLine2:
          "Akun Anda mungkin tidak seaman sebelumnya. Apakah Anda yakin ingin melanjutkan?",
        successMessage:
          "Verifikasi dua langkah melalui aplikasi otentikasi telah dihapus.",
      },
    },
    mfaPhoneCodePage: {
      title: "Tambah Verifikasi Kode SMS",
      primaryButton__addPhoneNumber: "Tambah nomor telepon",
      subtitle__availablePhoneNumbers:
        "Pilih nomor telepon untuk mendaftar verifikasi dua langkah kode SMS.",
      subtitle__unavailablePhoneNumbers:
        "Tidak ada nomor telepon yang tersedia untuk mendaftar verifikasi dua langkah kode SMS.",
      successMessage:
        "Verifikasi dua langkah kode SMS kini aktif untuk nomor telepon ini. Saat masuk, Anda perlu memasukkan kode verifikasi yang dikirimkan ke nomor telepon ini sebagai langkah tambahan.",
      removeResource: {
        title: "Hapus Verifikasi Dua Langkah",
        messageLine1:
          "{{identifier}} tidak akan lagi menerima kode verifikasi saat masuk.",
        messageLine2:
          "Akun Anda mungkin tidak seaman sebelumnya. Apakah Anda yakin ingin melanjutkan?",
        successMessage:
          "Verifikasi dua langkah kode SMS telah dihapus untuk {{mfaPhoneCode}}",
      },
    },
    backupCodePage: {
      title: "Tambah Kode Cadangan",
      title__codelist: "Kode Cadangan",
      subtitle__codelist: "Simpan dengan aman dan jaga kerahasiaannya.",
      infoText1: "Kode cadangan akan diaktifkan untuk akun ini.",
      infoText2:
        "Jaga kode cadangan dengan kerahasiaan dan simpan dengan aman. Anda dapat menghasilkan kembali kode cadangan jika Anda mencurigai bahwa mereka telah dikompromikan.",
      successSubtitle:
        "Anda dapat menggunakan salah satu kode ini untuk masuk ke akun Anda jika Anda kehilangan akses ke perangkat otentikasi Anda.",
      successMessage:
        "Kode cadangan kini diaktifkan. Anda dapat menggunakan salah satu kode ini untuk masuk ke akun Anda jika Anda kehilangan akses ke perangkat otentikasi Anda. Setiap kode hanya dapat digunakan satu kali.",
      actionLabel__copy: "Salin semua",
      actionLabel__copied: "Tersalin!",
      actionLabel__download: "Unduh .txt",
      actionLabel__print: "Cetak",
    },
    deletePage: {
      title: "Hapus Akun",
      messageLine1: "Apakah Anda yakin ingin menghapus akun Anda?",
      messageLine2:
        "Tindakan ini bersifat permanen dan tidak dapat dibatalkan.",
      actionDescription: "Ketik Hapus akun di bawah ini untuk melanjutkan.",
      confirm: "Hapus akun",
    },
  },

  userButton: {
    action__manageAccount: "Kelola akun",
    action__signOut: "Keluar",
    action__signOutAll: "Keluar dari semua akun",
    action__addAccount: "Tambahkan akun",
  },
  organizationSwitcher: {
    personalWorkspace: "Akun pribadi",
    notSelected: "Tidak ada organisasi yang dipilih",
    action__createOrganization: "Buat Organisasi",
    action__manageOrganization: "Kelola Organisasi",
    invitationCountLabel_single: "1 undangan tertunda untuk bergabung:",
    invitationCountLabel_many: "{{count}} undangan tertunda untuk bergabung:",
    action__invitationAccept: "Bergabung",
    suggestionCountLabel_single: "1 organisasi yang disarankan:",
    suggestionCountLabel_many: "{{count}} organisasi yang disarankan:",
    action__suggestionsAccept: "Minta untuk bergabung",
    suggestionsAcceptedLabel: "Menunggu persetujuan",
  },
  impersonationFab: {
    title: "Masuk sebagai {{identifier}}",
    action__signOut: "Keluar",
  },

  unstable__errors: {
    identification_deletion_failed:
      "Anda tidak dapat menghapus identifikasi terakhir Anda.",
    phone_number_exists:
      "Nomor telepon ini sudah digunakan. Silakan coba yang lain.",
    form_identifier_not_found: "",
    captcha_invalid:
      "Pendaftaran tidak berhasil karena validasi keamanan gagal. Silakan segarkan halaman untuk mencoba lagi atau hubungi dukungan untuk bantuan lebih lanjut.",
    form_password_pwned:
      "Kata sandi ini telah ditemukan sebagai bagian dari pelanggaran dan tidak dapat digunakan, silakan coba kata sandi lain.",
    form_username_invalid_length: "",
    form_username_invalid_character: "",
    form_param_format_invalid: "",
    form_param_format_invalid__email_address:
      "Alamat email harus berupa alamat email yang valid.",
    form_password_length_too_short: "",
    form_param_nil: "",
    form_code_incorrect: "",
    form_password_incorrect: "",
    not_allowed_access: "",
    form_identifier_exists: "",
    form_password_validation_failed: "Kata Sandi Salah",
    form_password_not_strong_enough: "Kata sandi Anda tidak cukup kuat.",
    form_password_size_in_bytes_exceeded:
      "Kata sandi Anda telah melebihi jumlah byte maksimum yang diizinkan, silakan pendekkan atau hapus beberapa karakter khusus.",
    passwordComplexity: {
      sentencePrefix: "Kata sandi Anda harus mengandung",
      minimumLength: "{{length}} atau lebih karakter",
      maximumLength: "kurang dari {{length}} karakter",
      requireNumbers: "angka",
      requireLowercase: "huruf kecil",
      requireUppercase: "huruf besar",
      requireSpecialCharacter: "karakter khusus",
    },
    zxcvbn: {
      notEnough: "Kata sandi Anda tidak cukup kuat.",
      couldBeStronger:
        "Kata sandi Anda bekerja, tetapi bisa menjadi lebih kuat. Coba tambahkan lebih banyak karakter.",
      goodPassword:
        "Kata sandi Anda memenuhi semua persyaratan yang diperlukan.",
      warnings: {
        straightRow: "Baris lurus tombol pada keyboard Anda mudah ditebak.",
        keyPattern: "Pola keyboard pendek mudah ditebak.",
        simpleRepeat: 'Karakter berulang seperti "aaa" mudah ditebak.',
        extendedRepeat:
          'Pola karakter berulang seperti "abcabcabc" mudah ditebak.',
        sequences: 'Sekuens karakter umum seperti "abc" mudah ditebak.',
        recentYears: "Tahun-tahun terbaru mudah ditebak.",
        dates: "Tanggal mudah ditebak.",
        topTen: "Ini adalah kata sandi yang sangat sering digunakan.",
        topHundred: "Ini adalah kata sandi yang sering digunakan.",
        common: "Ini adalah kata sandi yang umum digunakan.",
        similarToCommon: "Ini mirip dengan kata sandi yang sering digunakan.",
        wordByItself: "Kata tunggal mudah ditebak.",
        namesByThemselves: "Nama tunggal atau nama belakang mudah ditebak.",
        commonNames: "Nama dan nama belakang umum mudah ditebak.",
        userInputs: "Tidak boleh ada data pribadi atau terkait halaman.",
        pwned: "Kata sandi Anda terpapar oleh pelanggaran data di Internet.",
      },
      suggestions: {
        l33t: "Hindari penggantian huruf yang dapat diprediksi seperti '@' untuk 'a'.",
        reverseWords: "Hindari pengejaan terbalik dari kata-kata umum.",
        allUppercase: "Kapitalisasi beberapa huruf, tetapi tidak semua huruf.",
        capitalization: "Kapitalisasikan lebih dari huruf pertama.",
        dates: "Hindari tanggal dan tahun yang terkait dengan Anda.",
        recentYears: "Hindari tahun-tahun terbaru.",
        associatedYears: "Hindari tahun yang terkait dengan Anda.",
        sequences: "Hindari urutan karakter umum.",
        repeated: "Hindari kata dan karakter yang berulang.",
        longerKeyboardPattern:
          "Gunakan pola keyboard yang lebih panjang dan ubah arah pengetikan beberapa kali.",
        anotherWord: "Tambahkan lebih banyak kata yang kurang umum.",
        useWords: "Gunakan beberapa kata, tetapi hindari frasa umum.",
        noNeed:
          "Anda dapat membuat kata sandi yang kuat tanpa menggunakan simbol, angka, atau huruf besar.",
        pwned:
          "Jika Anda menggunakan kata sandi ini di tempat lain, Anda sebaiknya menggantinya.",
      },
    },
    form_param_max_length_exceeded__name:
      "Nama tidak boleh melebihi 256 karakter.",
    form_param_max_length_exceeded__first_name:
      "Nama depan tidak boleh melebihi 256 karakter.",
    form_param_max_length_exceeded__last_name:
      "Nama belakang tidak boleh melebihi 256 karakter.",
  },
  dates: {
    previous6Days:
      "Kemarin {{ date | weekday('id-ID','long') }} pukul {{ date | timeString('id-ID') }}",
    lastDay: "Kemarin {{ date | timeString('id-ID') }}",
    sameDay: "Hari ini pukul {{ date | timeString('id-ID') }}",
    nextDay: "Besok pukul {{ date | timeString('id-ID') }}",
    next6Days:
      "{{ date | weekday('id-ID','long') }} pukul {{ date | timeString('id-ID') }}",
    numeric: "{{ date | numeric('id-ID') }}",
  },
} as const;
