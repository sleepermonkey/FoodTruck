using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoodTruck.aControl;

namespace Jarju.Controllers
{
    public class FoodtruckController : Controller
    {
        public ActionResult CreateEvent(string id)
        {
            ViewBag.PageTitle = "Create Event";
            Session[Cons.SS_EVENT_ID] = id;
            return View();
        }

        public ActionResult FoodtruckProfile()
        {
            ViewBag.PageTitle = "Foodtruck Profile";
            return View();
        }

        public ActionResult EventRegisterView()
        {
            ViewBag.PageTitle = "Event Register";
            return View();
        }

        public ActionResult RegisterEvent(string id)
        {
            ViewBag.PageTitle = "Register Event";
            var x = Session[Cons.SS_SHOP_ID];
            Session[Cons.SS_EVENT_ID] = id;
            Session[Cons.SS_SHOP_ID] = x;
            return View();
        }
    }
}