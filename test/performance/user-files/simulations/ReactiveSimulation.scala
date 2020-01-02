import java.time.LocalDateTime

import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder
import jodd.util.RandomString
import scala.concurrent.duration._
import org.slf4j.{Logger, LoggerFactory}

class ReactiveSimulation extends Simulation {
  val logger: Logger = LoggerFactory.getLogger(classOf[Nothing])

  val authHeader = Map("Authorization" -> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHRlc3QucGwiLCJyb2xlIjoicmVzdGF1cmFudCIsImlkIjoiNWUwY2MwMWI5ZmNmMjA0NmI1N2U2NmYyIiwiaWF0IjoxNTc3ODkzOTgzfQ.H9MVz29H8m0FWZZ1_g6zzMp8jJZbJOQeNt0GOlrrd0M");

  val httpProtocol: HttpProtocolBuilder = http
    .baseURL("http://localhost:3000")
    .contentTypeHeader("application/json;charset=UTF-8")
    .acceptHeader("application/json;charset=UTF-8")

    val feeder: Iterator[Map[String, Any]] = Iterator.continually(
        Map("RestEmail" -> newEmail(),
            "UserEmail" -> newEmail()))


  val scn: ScenarioBuilder = scenario("ReactiveSimulation")
    .feed(feeder)
    .exec(
        http("registerRestaurant")
            .post("/restaurants/register")
            .body(StringBody("{ \"email\": \"${RestEmail}\", \"password\": \"password\", \"name\": \"restaurantName\", \"city\": \"Łódź\", \"address\": \"al. Politechniki 113\" }"))
            .check(jsonPath("$.user").saveAs("restId"))
    )
    .exec(
        http("login")
            .post("/auth/login")
            .body(StringBody("{ \"email\": \"${RestEmail}\", \"password\": \"password\" }"))
            .check(jsonPath("$.jwt").saveAs("restToken"))
    )
    .exec(
        http("registerUser")
            .post("/users/register")
            .body(StringBody("{ \"name\": \"Jan\", \"lastname\": \"Kowalski\", \"email\": \"${UserEmail}\", \"password\": \"password\" }"))
            .check(jsonPath("$._id").saveAs("userId"))
    )
    .exec(
        http("createOrder")
            .post("/orders")
            .body(StringBody("{ \"restaurant\": \"${restId}\" }"))
            .headers(Map("Authorization" -> "${restToken}"))
            .check(jsonPath("$._id").saveAs("orderId"))
            .check(status.is(201))
    )
    .exec(
        http("ordersForRestaurant")
            .get("/orders/${restId}")
            .headers(authHeader)
            .check(status.is(200))
            .check()
    )
    .exec(
        http("connectUserToOrder")
            .patch("/orders/connect/${orderId}")
            .body(StringBody("{ \"user\": \"${userId}\" }"))
            .headers(Map("Authorization" -> "${restToken}"))
            .check()
    )
    .exec(
        http("updateUserToken")
            .patch("/users/${userId}")
            .body(StringBody("{ \"token\": \"abcd\" }"))
            .headers(Map("Authorization" -> "${restToken}"))
            .check()
    )
    .exec(
        http("changeOrdersStatus")
            .patch("/orders/${orderId}")
            .body(StringBody("{ \"status\": 4 }"))
            .headers(Map("Authorization" -> "${restToken}"))
            .check()
    )


  setUp(scn.inject(atOnceUsers(50))).protocols(httpProtocol)
  //setUp(scn.inject( rampUsersPerSec(5) to 30 during(15 seconds))).protocols(httpProtocol)

  def newEmail(): String = RandomString.getInstance().randomAlpha(10)+"@test.pl"
}