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

        public JsonResult GetEventList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Event_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ID"] != null && Request.Form["ID"] != "") ? "'" + Request.Form["ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

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

        public JsonResult SubmitEvent()
        {
            DataTable dt = new DataTable();
            string ID = "0";

            gSQL = "EXEC [dbo].[sp_Event_Submit] '{0}','{1}','{2}','{3}','{4}','{5}','{6}'";
            gSQL = String.Format(gSQL
                                , Request.Form["EVENT_ID"]
                                , Request.Form["EVENT_NAME"]
                                , Request.Form["EVENT_PLACE"]
                                , ismoUtil.ConvertAngularDateTo120(Request.Form["START_DATE"].ToString())
                                , ismoUtil.ConvertAngularDateTo120(Request.Form["END_DATE"].ToString())
                                , Request.Form["DESCRIPTION"]
                                , Session[Cons.SS_USER_ID].ToString());
            //Response.Write(gSQL); <---- use for push string to AngularJS
            //Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            if (Request.Form["EVENT_ID"] == "0" || Request.Form["EVENT_ID"] == "")
                ID = dt.Rows[0]["EVENT_ID"].ToString();
            else
                ID = Request.Form["EVENT_ID"];

            gSQL = "EXEC [sp_Event_List] {0}";
            gSQL = String.Format(gSQL,ID);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPlanShop()
        {
            DataTable dt = new DataTable();

            if (Session[Cons.SS_EVENT_ID] != null && Session[Cons.SS_EVENT_ID].ToString() != "0")
            {
                gSQL = "EXEC [sp_Plan_Shop] {0}";
                gSQL = String.Format(gSQL,
                             Session[Cons.SS_EVENT_ID].ToString());
                dt = odb.SqlQuery(gSQL, mDBName);
            }


            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitPlan()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Plan_Submit] '{0}','{1}','{2}','{3}'";
            gSQL = String.Format(gSQL
                                , Request.Form["EVENT_ID"]
                                , Request.Form["WIDTH"]
                                , Request.Form["DEPTH"]
                                , Request.Form["GRID_SIZE"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitPlanShop()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Plan_Shop_Submit] '{0}','{1}','{2}','{3}','{4}','{5}','{6}'";
            gSQL = String.Format(gSQL
                                , Request.Form["LOCAL_ID"]
                                , Request.Form["EVENT_ID"]
                                , Request.Form["NAME"]
                                , Request.Form["PRICE"]
                                , Request.Form["DEPOSIT_FEE_RATE"]
                                , Request.Form["FT"]
                                , Request.Form["BLOCK_ID"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UploadCoverImage(HttpPostedFileBase File, string ID)
        {
            if (File != null && File.ContentLength > 0)
            {
                // Write file to Server
                string gFileName = File.FileName;
                string uploadLocationStr = "/Upload/Event/Cover/" + ID + "/";
                string uploadLocation = Server.MapPath(uploadLocationStr);
                string fileLocation = uploadLocationStr + gFileName;

                DataService.UploadFileByLocation(File
                                                , uploadLocation
                                                , Server.MapPath(fileLocation));


                //gSQL = String.Format("EXEC [sp_Leasing_Temp_Check] '{0}'"
                gSQL = String.Format("EXEC [sp_Event_Cover_Upload] '{0}','{1}'"
                                    , ID
                                    , fileLocation);
                DataTable dt = odb.SqlQuery(gSQL, mDBName);

                return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { result = 500 });
            }
        }

        [HttpPost]
        public JsonResult UploadPlanImage(HttpPostedFileBase File, string ID)
        {
            if (File != null && File.ContentLength > 0)
            {
                // Write file to Server
                string gFileName = File.FileName;
                string uploadLocationStr = "/Upload/Event/Plan/" + ID + "/";
                string uploadLocation = Server.MapPath(uploadLocationStr);
                string fileLocation = uploadLocationStr + gFileName;

                DataService.UploadFileByLocation(File
                                                , uploadLocation
                                                , Server.MapPath(fileLocation));

                gSQL = String.Format("EXEC [sp_Event_Plan_Upload] '{0}','{1}'"
                                    , ID
                                    , fileLocation);
                DataTable dt = odb.SqlQuery(gSQL, mDBName);

                return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { result = 500 });
            }
        }
    }
}