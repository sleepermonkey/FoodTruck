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
                        SHOP_ID, "1", Request.Form["ITEM_STYLE_ID"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }
    }
}