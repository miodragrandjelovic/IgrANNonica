using Microsoft.EntityFrameworkCore.Migrations;

namespace projekat.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RegisterDetails",
                columns: table => new
                {
                    RegisterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    indexNumber = table.Column<int>(type: "int", nullable: false),
                    yearNumber = table.Column<int>(type: "int", nullable: false),
                    fullName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    subjectName = table.Column<string>(type: "nvarchar(100)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegisterDetails", x => x.RegisterId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegisterDetails");
        }
    }
}
