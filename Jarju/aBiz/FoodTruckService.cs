using FoodTruck.aControl;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;

namespace FoodTruck.aBiz
{
    public class FoodTruckService
    {

        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["BizDBName"];

        //----------------------------------------------------------------

        public string GetCampaignPeriodInfo(string id)
        {
            string gInfo ;
            DataTable dt = new DataTable();

            gSQL = "SELECT [PERIOD_NAME] FROM [dbo].[TBL_CMP_Period] WHERE ID = {0}";
            gSQL = String.Format(gSQL,id);
            dt = odb.SqlQuery(gSQL, mDBName);

            gInfo = dt.Rows[0]["PERIOD_NAME"].ToString();
            return gInfo;
        }

        public string GetFleetPeriodInfo(string id)
        {
            string gInfo;
            DataTable dt = new DataTable();

            gSQL = "SELECT [PERIOD_NAME] FROM [dbo].[TBL_FLT_Period] WHERE ID = {0}";
            gSQL = String.Format(gSQL, id);
            dt = odb.SqlQuery(gSQL, mDBName);

            gInfo = dt.Rows[0]["PERIOD_NAME"].ToString();
            return gInfo;
        }


        public void GenFleetProgram(string id)
        {
            gSQL = "EXEC [dbo].[sp_FLT_Fleet_Monthly_Program_Gen] '{0}','{1}'";
            gSQL = String.Format(gSQL, id, "SYS");
            odb.SqlExecute(gSQL, mDBName);
        }

        public void ImportToGrid(string pFilePath, string pExtension, string isHDR,string pUserID,string pJobName)
        {
           // Insert to database
           gSQL = "EXEC [sp_ImportXLSX_BatchScan] '{0}','{1}','{2}','{3}'";
           gSQL = String.Format(gSQL, pFilePath, "SCAN", pUserID, pJobName);
           odb.SqlExecute(gSQL, mDBName);

        }
        
        //----------------------------------------------------------------
        public DataTable GetSourceType()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC sp_SourceType_Get";
            dt = odb.SqlQuery(gSQL, mDBName);

            return dt;
        }       


    }
}