using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using FoodTruck.aBiz;
using FoodTruck.aControl;
using System.Configuration;
using System.Globalization;

namespace FoodTruck.Controllers
{
    public class FoodtruckDsController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        public JsonResult GetFoodtruckProfile()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";
            string USER_ID = "";
            gSQL = "EXEC [sp_Shop] '{0}','{1}'";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            if (Session[Cons.SS_USER_ID] == null)
                USER_ID = "0";
            else
                USER_ID = Session[Cons.SS_USER_ID].ToString();

            gSQL = String.Format(gSQL,
                            SHOP_ID,
                            USER_ID);
            dt = odb.SqlQuery(gSQL, mDBName);
            
            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDislikeMenuStyleList()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = "EXEC [sp_Dislike_Menu_Style_List] {0}";
            gSQL = String.Format(gSQL, SHOP_ID);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDislikeMenuList()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = "EXEC [sp_Dislike_Menu_List] '{0}'";
            gSQL = String.Format(gSQL, SHOP_ID);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOwnMenuList()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = "EXEC [sp_Own_Menu_List] '{0}'";
            gSQL = String.Format(gSQL, SHOP_ID);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteDislikeMenu()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = "EXEC [sp_Dislike_Menu_Style_Delete] '{0}'";
            gSQL = String.Format(gSQL,SHOP_ID);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitShop()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";
            string USER_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            if (Session[Cons.SS_USER_ID] == null)
                USER_ID = "0";
            else
                USER_ID = Session[Cons.SS_USER_ID].ToString();

            gSQL = "EXEC [sp_Shop_Submit] '{0}','{1}','{2}'";
            gSQL = String.Format(gSQL,
                        SHOP_ID, Request.Form["SHOP_NAME"], USER_ID);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitDislikeMenuStyle()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = "EXEC [sp_Dislike_Menu_Style_Submit] '{0}','{1}','{2}'";
            gSQL = String.Format(gSQL,
                        SHOP_ID,"0", Request.Form["ITEM_STYLE_ID"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitDislikeMenu()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = "EXEC [sp_Dislike_Menu_Style_Submit] '{0}','{1}','{2}'";
            gSQL = String.Format(gSQL,
                        SHOP_ID, "1", Request.Form["ITEM_MENU_ID"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitNewMenu()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = "EXEC [sp_Own_Menu_Submit] '{0}','{1}','{2}','{3}'";
            gSQL = String.Format(gSQL, SHOP_ID, Request.Form["ITEM_MENU_ID"], Request.Form["NAME"], Request.Form["MAIN_ITEM"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult RegisterFoodtruck()
        {
            DataTable dt = new DataTable();
            string SHOP_ID = "";
            gSQL = "EXEC [sp_Shop_Event_Register] '{0}','{1}','{2}','{3}'";

            if (Session[Cons.SS_SHOP_ID] == null)
                SHOP_ID = "0";
            else
                SHOP_ID = Session[Cons.SS_SHOP_ID].ToString();

            gSQL = String.Format(gSQL,
                            Session[Cons.SS_EVENT_ID].ToString(),
                            SHOP_ID,
                            ismoUtil.ConvertAngularDateTo120(Request.Form["ED"].ToString())
                            ,"0");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }
    }
}