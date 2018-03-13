using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace FoodTruck.aControl
{
    public static class DTFM
    {
        public static Boolean isValidDataSet(DataSet ds)
        {
            Boolean isValidDS = false;
            if (ds != null)
                if (ds.Tables.Count > 0)
                    if (ds.Tables[0].Rows.Count > 0)
                        isValidDS = true;

            return isValidDS;
        }

        public static Boolean isValidDataSetMultiDataTable(DataSet ds)
        {
            Boolean isValidDS = false;
            if (ds != null)
                if (ds.Tables.Count > 0)
                    isValidDS = true;

            return isValidDS;
        }

        public static List<Dictionary<string, object>> convertToList(DataTable dtData)
        {
            List<Dictionary<string, object>> lstRows = new List<Dictionary<string, object>>();
            Dictionary<string, object> dictRow = null;

            foreach (DataRow dr in dtData.Rows)
            {
                dictRow = new Dictionary<string, object>();
                foreach (DataColumn col in dtData.Columns)
                {
                    dictRow.Add(col.ColumnName, dr[col]);
                }
                lstRows.Add(dictRow);
            }
            return lstRows;
        }

        public static Dictionary<string, object> convertToList(DataSet ds)
        {
            List<Dictionary<string, object>> lstRows = new List<Dictionary<string, object>>();
            List<Dictionary<string, object>> subLstRows = null;
            Dictionary<string, object> dictRow = new Dictionary<string, object>();
            Dictionary<string, object> subDictRow = null;
            int tableIndex = 0;
            string dtName = "";

            foreach (DataTable dtData in ds.Tables)
            {
                subLstRows = new List<Dictionary<string, object>>();

                foreach (DataRow dr in dtData.Rows)
                {
                    subDictRow = new Dictionary<string, object>();
                    foreach (DataColumn col in dtData.Columns)
                    {
                        subDictRow.Add(col.ColumnName, dr[col]);
                    }
                    subLstRows.Add(subDictRow);
                }

                dtName = string.Concat("table", tableIndex);
                tableIndex = tableIndex + 1;

                if (dtData.TableName != "" && !dictRow.ContainsKey(dtData.TableName))
                {
                    dictRow.Add(dtData.TableName, subLstRows);
                }
                else
                {
                    dictRow.Add(dtName, subLstRows);
                }

                //dictRow.Add(dtName, subLstRows);
            }

            return dictRow;
        }

        public static Dictionary<string, string> convertToList(string val)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("returnResult", val);
            return dict;
        }

      
    }
}