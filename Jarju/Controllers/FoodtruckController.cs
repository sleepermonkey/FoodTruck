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
    }
}