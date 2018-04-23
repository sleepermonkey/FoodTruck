using FoodTruck.aBiz;
using FoodTruck.aControl;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jarju.Controllers
{
    public class SystemController : Controller
    {


        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        //------------------------------------------------------------------------------------
        [HttpPost]
        public ActionResult Login(string usrname, string password)
        {
            string user = usrname;
            string pass = password;
            //string lblMsg = "";
            //string IP = "";

            muliLang msgLang = new muliLang();
            //ismoUtil ismo = new ismoUtil();

            //---- Check user password only A-Z a-z 0-9

            //if (!ismo.CheckSpecialCharacter(user))
            //{
            //    lblMsg = "User name ไม่ถูกต้อง";
            //    return RedirectToAction("Index", "Home", new { noti = lblMsg });
            //}

            //IP = Request.UserHostAddress;

            //DataTable dt = new DataTable();

            //gSQL = "EXEC sp_User_LogIn '{0}','{1}'";
            //gSQL = String.Format(gSQL, user, password);
            //dt = odb.SqlQuery(gSQL, mDBName);

            //if (dt.Rows.Count > 0)
            //{
            //    if (dt.Rows[0]["UserStatus"].ToString() == "0")
            //    {
            //        return RedirectToAction("Index", "Home", new { noti = "รหัสผู้ใช้นี้ ยังไม่ได้รับการอนุมัติให้ใช้งานระบบ" });
            //    }

            //    Session.Add(Cons.SS_USER_ID, dt.Rows[0]["D"].ToString());
            //    Session.Add(Cons.SS_USER_NAME, dt.Rows[0]["UserName"].ToString());
            //    Session.Add(Cons.SS_USER_LAST_NAME, dt.Rows[0]["UserLastName"].ToString());
            //    Session.Add(Cons.SS_USER_GROUP, dt.Rows[0]["UserGroupID"].ToString());
            //    Session.Add(Cons.SS_USER_DEPT, dt.Rows[0]["Department"].ToString());
            //    Session.Add(Cons.SS_USER_LANG, dt.Rows[0]["UserLanguage"].ToString());


            //    int iExpireDay = Int32.Parse(dt.Rows[0]["IsPWexpire"].ToString());

            //    if (dt.Rows[0]["PasswordExpired"].ToString() == "")
            //    {
            //        gSQL = "EXEC [sp_User_CheckIn] {0},'{1}'";
            //        gSQL = String.Format(gSQL, dt.Rows[0]["UserID"].ToString(), IP);
            //        odb.SqlExecute(gSQL, mDBName);
            //        return RedirectToAction("ChangePW", "System");
            //    }
            //    else if (iExpireDay < 0)
            //    {
            //        return RedirectToAction("Index", "Home", new { noti = "รหัสผ่านหมดอายุ โปรติดต่อเจ้าหน้าที่" });
            //    }
            //    else if (iExpireDay <= 1)
            //    {
            //        gSQL = "EXEC [sp_User_CheckIn] {0},'{1}'";
            //        gSQL = String.Format(gSQL, dt.Rows[0]["UserID"].ToString(), IP);
            //        odb.SqlExecute(gSQL, mDBName);

            //        return RedirectToAction("ChangePW", "System", new { noti = "รหัสผ่านจะหมดอายุภายวัน 1 วัน กรุณาเปลี่ยนรหัสผ่าน" });
            //    }
            //    else if (iExpireDay <= 15)
            //    {
            //        gSQL = "EXEC [sp_User_CheckIn] {0},'{1}'";
            //        gSQL = String.Format(gSQL, dt.Rows[0]["UserID"].ToString(), IP);
            //        odb.SqlExecute(gSQL, mDBName);

            //        return RedirectToAction("Main", "System", new { noti = "รหัสผ่านจะหมดอายุภายวัน " + iExpireDay.ToString() + "  วัน กรุณาเปลี่ยนรหัสผ่าน" });
            //    }

            //    else
            //    {
            //        gSQL = "EXEC [sp_User_CheckIn] {0},'{1}'";
            //        gSQL = String.Format(gSQL, dt.Rows[0]["UserID"].ToString(), IP);
            //        odb.SqlExecute(gSQL, mDBName);



            Session.Add(Cons.SS_USER_ID, '1');
            Session.Add(Cons.SS_USER_NAME, usrname);
            Session.Add(Cons.SS_USER_LAST_NAME, '1');
            Session.Add(Cons.SS_USER_ROLE, '1'); //1 = Organizer 2 = Food Truck 3 = Customer
            Session.Add(Cons.SS_USER_LANG, '1');
            Session.Add(Cons.SS_SHOP_ID, '1');

            return RedirectToAction("Index", "Home");
            //    }

            //}
            //else
            //{
            //    return RedirectToAction("Index", "Home", new { noti = "User name และ password ไม่ถูกต้อง" });
            //}
        }

        [HttpGet]
        public ActionResult LoginByToken(string tokenStr)
        {

            Session.Add(Cons.SS_USER_ID, '1');
            Session.Add(Cons.SS_USER_NAME, tokenStr);
            Session.Add(Cons.SS_USER_LAST_NAME, '1');
            Session.Add(Cons.SS_USER_ROLE, '1'); //1 = Organizer 2 = Food Truck 3 = Customer
            Session.Add(Cons.SS_USER_LANG, '1');

            return RedirectToAction("Main", "System");
        }

        [SessionExpire]
        [HttpPost]
        public ActionResult AddUser(string ccUserPassword, string ccTitle, string ccUserName
                                , string ccUserLastName, string ccPersonalID, string ccEmail
                                , string ccDepartment, string ccPosition, string ccUserGroupID, string ccPhone, string ccEmployeeNo)
        {
            string lblMsg = "";
            try
            {
                gSQL = "EXEC [sp_User_Add] '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}'";
                gSQL = String.Format(gSQL, ccEmployeeNo, ccUserPassword, ccTitle, ccUserName, ccUserLastName, ccPersonalID, ccEmail
                                            , ccDepartment, ccPosition, ccUserGroupID, ccPhone, ccEmployeeNo, Session[Cons.SS_USER_ID].ToString());

                odb.SqlExecute(gSQL, mDBName);
                lblMsg = "เพิ่มผู้ใช้เรียบร้อย รอการอนุมัติการใช้งานจากเจ้าหน้าที่ท่านอื่น";

            }
            catch (Exception ex)
            {
                lblMsg = ex.Message;
            }

            return RedirectToAction("AddUser", "System", new { noti = lblMsg });
        }

        private string VerifyRegister(string ccPersonalID, string ccEmployeeNo)
        {
            DataTable dt = new DataTable();

            if (!VerifyPeopleID(ccPersonalID))
            {
                return "รหัสบัตรประชาชน ไม่ถูกต้อง";
            }


            gSQL = "SELECT ISNULL([EmployeeNo],'0') AS EmployeeNo  FROM [dbo].[TBL_SYS_User]  WHERE EmployeeNo = '{0}'";
            gSQL = String.Format(gSQL, ccEmployeeNo);
            dt = odb.SqlQuery(gSQL, mDBName);

            if (dt.Rows.Count > 0)
            {
                return "รหัสพนักงานนี้ ได้ใช้ลงทะเบียนแล้ว";

            }

            gSQL = "SELECT ISNULL(PersonalID,'0') AS PersonalID  FROM [dbo].[TBL_SYS_User]  WHERE PersonalID = '{0}'";
            gSQL = String.Format(gSQL, ccPersonalID);
            dt = odb.SqlQuery(gSQL, mDBName);

            if (dt.Rows.Count > 0)
            {
                return "รหัสพนักงานนี้ ได้ใช้ลงทะเบียนแล้ว";

            }

            return "";

        }

        private Boolean VerifyPeopleID(String PID)
        {
            //ตรวจสอบว่าทุก ๆ ตัวอักษรเป็นตัวเลข
            if (PID.ToCharArray().All(c => char.IsNumber(c)) == false)
                return false;
            //ตรวจสอบว่าข้อมูลมีทั้งหมด 13 ตัวอักษร
            if (PID.Trim().Length != 13)
                return false;

            int sumValue = 0;
            for (int i = 0; i < PID.Length - 1; i++)
                sumValue += int.Parse(PID[i].ToString()) * (13 - i);
            int v = 11 - (sumValue % 11);
            return PID[12].ToString() == v.ToString();
        }

        //---------------------------------------- View -----------------------------------

        [SessionExpire]
        public ActionResult Main(string noti = "")
        {
            ViewBag.Username = Session[Cons.SS_USER_NAME].ToString();
            ViewBag.MessageNoti = noti;
            if (Session[Cons.SS_USER_ROLE].ToString() == "3")
            {
                return View("MainPage");

            }
            else
            {
                return View("Main");
            }

        }

        [SessionExpire]
        public ActionResult AddUser(string noti = "")
        {
            ViewBag.Username = Session[Cons.SS_USER_NAME].ToString();
            ViewBag.MessageNoti = noti;
            return View();
        }


        [SessionExpire]
        public ActionResult ApproveUser(string noti = "")
        {
            ViewBag.Username = Session[Cons.SS_USER_NAME].ToString();
            ViewBag.MessageNoti = noti;
            return View();
        }

        [SessionExpire]
        public ActionResult UserList(string noti = "")
        {
            ViewBag.Username = Session[Cons.SS_USER_NAME].ToString();
            ViewBag.MessageNoti = noti;
            return View();
        }


        [SessionExpire]
        public ActionResult Department(string noti = "")
        {
            ViewBag.Username = Session[Cons.SS_USER_NAME].ToString();
            ViewBag.MessageNoti = noti;
            return View();
        }


        [SessionExpire]
        public ActionResult CheckLogIn(string noti = "")
        {

            ViewBag.MessageNoti = noti;
            return View();
        }

        [SessionExpire]
        public ActionResult ChangePW(string noti = "")
        {
            ViewBag.Username = Session[Cons.SS_USER_NAME].ToString();
            ViewBag.MessageNoti = noti;
            return View();
        }

        [SessionExpire]
        public ActionResult Personal(string noti = "")
        {
            ViewBag.Username = Session[Cons.SS_USER_NAME].ToString();
            ViewBag.MessageNoti = noti;
            return View();
        }

        [SessionExpire]
        public ActionResult ChangLangTH(string noti = "")
        {


            if (Session[Cons.SS_USER_LANG].ToString() == "EN")
            {
                Session[Cons.SS_USER_LANG] = "TH";

                gSQL = "EXEC sp_User_Lang_Update '{0}','{1}'";

                gSQL = String.Format(gSQL, Session[Cons.SS_USER_ID].ToString(), Session[Cons.SS_USER_LANG]);

                odb.SqlExecute(gSQL, mDBName);
            }
            // if (@Request.RawUrl == "/Home/Contacts")

            return RedirectToAction("Main", "System");
        }

        [SessionExpire]
        public ActionResult ChangLangEN(string noti = "")
        {

            if (Session[Cons.SS_USER_LANG].ToString() == "TH")
            {
                Session[Cons.SS_USER_LANG] = "EN";

                gSQL = "EXEC sp_User_Lang_Update '{0}','{1}'";

                gSQL = String.Format(gSQL, Session[Cons.SS_USER_ID].ToString(), Session[Cons.SS_USER_LANG]);

                odb.SqlExecute(gSQL, mDBName);
            }
            // if (@Request.RawUrl == "/Home/Contacts")

            return RedirectToAction("Main", "System");
        }


        public ActionResult ForgotPW(string noti = "")
        {

            ViewBag.MessageNoti = noti;
            return View();
        }


        public ActionResult BackOut()
        {
            Session.Contents.RemoveAll();
            return RedirectToAction("Index", "Home");
        }
    }
}